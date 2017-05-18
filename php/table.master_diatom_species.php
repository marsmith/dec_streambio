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
Editor::inst( $db, 'master_diatom_species', 'diatom_genspecies' )
	->fields(
		Field::inst( 'diatom_genspecies' ),
		Field::inst( 'division' ),
		Field::inst( 'class' ),
		Field::inst( 'order' ),
		Field::inst( 'family' )	
	)
	->process( $_POST )
	->json();
