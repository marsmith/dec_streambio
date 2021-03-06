<?php

/*
 * Editor server script for DB table master_sites
 * Created by http://editor.datatables.net/generator
 */

// DataTables PHP library and database connection
include( "lib/DataTables.php" );

// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Mjoin,
	DataTables\Editor\Options,
	DataTables\Editor\Upload,
	DataTables\Editor\Validate;

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'master_sites', array('basin', 'location', 'rivmile') )
	->fields(
		Field::inst( 'basin' ),
		Field::inst( 'location' ),
		Field::inst( 'rivmile' ),
		Field::inst( 'name' ),
		Field::inst( 'latitude' ),
		Field::inst( 'longitude' )
	)
	->process( $_POST )
	->json();
