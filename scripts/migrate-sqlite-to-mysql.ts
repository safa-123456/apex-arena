import dotenv from "dotenv";
import mysql from "mysql2/promise";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

dotenv.config();

type Counts = {
	users: number;
	bookings: number;
	applications: number;
};

async function run() {
	const sqliteFile = process.env.SQLITE_FILE || "./database.sqlite";
	const mysqlHost = (process.env.DB_HOST || "localhost").trim();
	const mysqlUser = (process.env.DB_USER || "root").trim();
	const mysqlPassword = (process.env.DB_PASSWORD || "").trim();
	const mysqlDatabase = (process.env.DB_NAME || "apex_arena").trim();
	const mysqlPort = Number((process.env.DB_PORT || "3306").trim());

	console.log(`SQLite source: ${sqliteFile}`);
	console.log(`MySQL target: ${mysqlUser}@${mysqlHost}:${mysqlPort}/${mysqlDatabase}`);

	const sqliteDb = await open({
		filename: sqliteFile,
		driver: sqlite3.Database,
	});

	const mysqlPool = mysql.createPool({
		host: mysqlHost,
		user: mysqlUser,
		password: mysqlPassword,
		database: mysqlDatabase,
		port: mysqlPort,
		waitForConnections: true,
		connectionLimit: 5,
		queueLimit: 0,
	});

	const conn = await mysqlPool.getConnection();
	const counts: Counts = { users: 0, bookings: 0, applications: 0 };

	try {
		await conn.beginTransaction();

		const users = await sqliteDb.all<any[]>(
			"SELECT uid, email, displayName, photoURL, created_at FROM users"
		);

		for (const u of users) {
			await conn.execute(
				`INSERT INTO users (uid, email, displayName, photoURL, created_at)
				 VALUES (?, ?, ?, ?, ?)
				 ON DUPLICATE KEY UPDATE
					 email = VALUES(email),
					 displayName = VALUES(displayName),
					 photoURL = VALUES(photoURL)`,
				[u.uid, u.email || "", u.displayName || null, u.photoURL || null, u.created_at || null]
			);
			counts.users += 1;
		}

		const bookings = await sqliteDb.all<any[]>(
			"SELECT id, user_uid, sport_id, sport_name, trainer_id, trainer_name, date, time, price, status, created_at FROM bookings"
		);

		for (const b of bookings) {
			await conn.execute(
				`INSERT INTO bookings (id, user_uid, sport_id, sport_name, trainer_id, trainer_name, date, time, price, status, created_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				 ON DUPLICATE KEY UPDATE
					 user_uid = VALUES(user_uid),
					 sport_id = VALUES(sport_id),
					 sport_name = VALUES(sport_name),
					 trainer_id = VALUES(trainer_id),
					 trainer_name = VALUES(trainer_name),
					 date = VALUES(date),
					 time = VALUES(time),
					 price = VALUES(price),
					 status = VALUES(status)`,
				[
					b.id,
					b.user_uid,
					b.sport_id,
					b.sport_name,
					b.trainer_id || null,
					b.trainer_name || null,
					b.date,
					b.time,
					b.price,
					b.status || "confirmed",
					b.created_at || null,
				]
			);
			counts.bookings += 1;
		}

		const applications = await sqliteDb.all<any[]>(
			"SELECT id, user_uid, full_name, email, phone, sport_interest, experience, status, created_at FROM applications"
		);

		for (const a of applications) {
			await conn.execute(
				`INSERT INTO applications (id, user_uid, full_name, email, phone, sport_interest, experience, status, created_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
				 ON DUPLICATE KEY UPDATE
					 user_uid = VALUES(user_uid),
					 full_name = VALUES(full_name),
					 email = VALUES(email),
					 phone = VALUES(phone),
					 sport_interest = VALUES(sport_interest),
					 experience = VALUES(experience),
					 status = VALUES(status)`,
				[
					a.id,
					a.user_uid,
					a.full_name,
					a.email || "",
					a.phone || "",
					a.sport_interest,
					a.experience,
					a.status || "pending",
					a.created_at || null,
				]
			);
			counts.applications += 1;
		}

		await conn.commit();
		console.log("Migration completed.");
		console.log(`Users migrated: ${counts.users}`);
		console.log(`Bookings migrated: ${counts.bookings}`);
		console.log(`Applications migrated: ${counts.applications}`);
	} catch (error) {
		await conn.rollback();
		throw error;
	} finally {
		conn.release();
		await mysqlPool.end();
		await sqliteDb.close();
	}
}

run().catch((error) => {
	console.error("Migration failed:", error);
	process.exit(1);
});
