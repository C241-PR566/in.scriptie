import conn from '../services/storeData.js';
import crypto from 'crypto';
import { bucket } from '../services/gcsConfig.js';

async function saveTranslation(userId, originalname, mimetype, size, buffer) {
  const translationId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const fileName = `images/${translationId}-${originalname}`;
  const file = bucket.file(fileName);

  // Upload gambar ke GCS
  await file.save(buffer, {
    metadata: {
      contentType: mimetype,
    },
  });

  const insertTranslation = `INSERT INTO translations (id, user_id, image_name, mimetype, size, created_at, translation_result)
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;

  await new Promise((resolve, reject) => {
    conn.query(insertTranslation, [translationId, userId, originalname, mimetype, size, createdAt, null], (error) => {
      if (error) return reject(error);
      resolve();
    });
  });

  return {
    id: translationId,
    user_id: userId,
    image_name: originalname,
    mimetype,
    size,
    created_at: createdAt,
    translation_result: null,
    image_url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
  };
}

async function getUserTranslations(userId) {
  const getTranslations = `SELECT * FROM translations WHERE user_id = ? ORDER BY created_at DESC`;
  const translations = await new Promise((resolve, reject) => {
    conn.query(getTranslations, [userId], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  // Tambahkan URL gambar untuk setiap translasi
  return translations.map((translation) => ({
    ...translation,
    image_url: `https://storage.googleapis.com/${bucket.name}/images/${translation.id}-${translation.image_name}`,
  }));
}

export { saveTranslation, getUserTranslations };
