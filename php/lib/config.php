<?php if (!defined('DATATABLES')) exit(); // Ensure being used in DataTables env.

/*
 * DB connection script for Editor
 * Created by http://editor.datatables.net/generator
 */

// Enable error reporting for debugging (remove for production)
error_reporting(E_ALL);
ini_set('display_errors', '1');

/*
 * Edit the following with your database connection options
 */
$sql_details = array(
	"type" => "Mysql",  // Database type: "Mysql", "Postgres", "Sqlserver", "Sqlite" or "Oracle"
	"user" => "root",       // Database user name
	"pass" => "root",       // Database password
	"host" => "127.0.0.1",       // Database host
	"port" => "",       // Database connection port (can be left empty for default)
	"db"   => "streambio_db",       // Database name
	"dsn"  => "charset=utf8"        // PHP DSN extra information. Set as `charset=utf8` if you are using MySQL
);
