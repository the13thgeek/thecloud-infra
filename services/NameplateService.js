const db = require('../config/database');

class NameplateService {
  /**
   * Total spawn weight across pullable nameplates. Used to weight this pool
   * against other gacha pools (e.g. titles) when pull_type = 'all'.
   */
  async getPullWeight(isPremium) {
    const query = isPremium
      ? 'SELECT SUM(spawn_weight) AS total FROM tbl_nameplates WHERE spawn_weight IS NOT NULL AND is_pull = 1'
      : 'SELECT SUM(spawn_weight) AS total FROM tbl_nameplates WHERE spawn_weight IS NOT NULL AND is_premium = 0 AND is_pull = 1';

    const result = await db.executeOne(query);
    return result?.total || 0;
  }

  /**
   * Perform weighted random gacha pull
   */
  async performGacha(isPremium) {
    const query = isPremium
      ? 'SELECT * FROM tbl_nameplates WHERE spawn_weight IS NOT NULL AND is_pull = 1'
      : 'SELECT * FROM tbl_nameplates WHERE spawn_weight IS NOT NULL AND is_premium = 0 AND is_pull = 1';

    const nameplates = await db.execute(query);

    if (nameplates.length === 0) {
      throw new Error('No nameplates available for pulling');
    }

    return this.weightedRandom(nameplates);
  }

  /**
   * Weighted random selection algorithm
   */
  weightedRandom(nameplates) {
    const totalRate = nameplates.reduce((sum, nameplate) => sum + nameplate.spawn_weight, 0);
    const random = Math.random() * totalRate;
    
    let cumulativeRate = 0;
    for (const nameplate of nameplates) {
      cumulativeRate += nameplate.spawn_weight;
      if (random <= cumulativeRate) {
        return nameplate;
      }
    }

    return nameplates[nameplates.length - 1];
  }

  /**
   * Add nameplate to user's collection
   */
  async addNameplateToUser(userId, nameplateId) {
    // Don't issue nameplate ID 0 (Try Again)
    if (nameplateId <= 0) return false;

    const existing = await db.executeOne(
      'SELECT COUNT(*) as count FROM tbl_user_nameplates WHERE user_id = ? AND nameplate_id = ?',
      [userId, nameplateId]
    );

    if (existing.count > 0) return false;

    // Set new nameplate as default
    await db.execute(
      'UPDATE tbl_users SET active_nameplate_id = ? WHERE id = ?',
      [nameplateId, userId]
    );

    await db.execute(
      'INSERT INTO tbl_user_nameplates(user_id, nameplate_id) VALUES(?,?)',
      [userId, nameplateId]
    );

    return true;
  }

  /**
   * Set user's active nameplate
   */
  async setActiveNameplate(userId, nameplateId) {
    // Verify user owns the nameplate
    const owned = await db.executeOne(
      'SELECT 1 FROM tbl_user_nameplates WHERE user_id = ? AND nameplate_id = ?',
      [userId, nameplateId]
    );

    if (!owned) {
      throw new Error('User does not own this nameplate');
    }

    await db.execute(
      'UPDATE tbl_users SET active_nameplate_id = ? WHERE id = ?',
      [nameplateId, userId]
    );

    return true;
  }

  /**
   * Get available nameplates for pulling
   */
  async getAvailableNameplates() {
    return await db.execute(
      `SELECT id, name, catalog_no, sysname, is_premium, is_event, is_rare, is_new 
       FROM tbl_nameplates 
       WHERE id > 0 AND is_pull = 1 AND is_active = 1 
       ORDER BY is_premium DESC, is_new DESC, catalog_no`
    );
  }

  /**
   * Get full nameplate catalog
   */
  async getCatalog() {
    return await db.execute(
      `SELECT *, DATE_FORMAT(created, '%b %Y') as \'release\'
       FROM tbl_nameplates
       WHERE id > 0 AND is_active = 1
       ORDER BY
         CASE 
           WHEN LEFT(catalog_no, 2) IN ('SP','GX','EX') THEN 1
           WHEN LEFT(catalog_no, 2) IN ('RG', 'RP') THEN 2
           ELSE 3
         END,
         is_premium DESC,
         catalog_no DESC,
         name`
    );
  }

  /**
   * Get a user's most recently acquired nameplates (for chat/bot display, e.g. !getnp).
   * For the full inventory (e.g. validating !setnameplate), use UserService.getUserNameplates instead.
   */
  async getRecentUserNameplates(userId, limit = null) {
    // mysql2 prepared statements don't support placeholders inside LIMIT/OFFSET,
    // so this has to be inlined as a validated integer rather than bound as a param.
    const safeLimit = limit ? Math.max(1, Math.floor(Number(limit))) : null;

    const query = `
      SELECT n.sysname, n.name, n.is_premium
      FROM tbl_nameplates n
      INNER JOIN tbl_user_nameplates un ON n.id = un.nameplate_id
      WHERE un.user_id = ?
      ORDER BY un.acquired_at DESC
      ${safeLimit ? `LIMIT ${safeLimit}` : ''}`;

    const nameplates = await db.execute(query, [userId]);

    return nameplates.map(nameplate => ({
      sysname: nameplate.sysname,
      display: nameplate.is_premium ? `Premium ${nameplate.name}` : nameplate.name
    }));
  }
}

module.exports = new NameplateService();