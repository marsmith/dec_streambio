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
Editor::inst( $db, 'master_field', array('basin', 'location', 'rivmile') )
	->fields(
		Field::inst( 'basin' ),
		Field::inst( 'location' ),
		Field::inst( 'rivmile' ),
		Field::inst( 'coll_date' )
		    ->validator( 'Validate::dateFormat', array(
                'empty' => false,
                'format' => 'm-d-Y g:i A'
            ) )
            ->getFormatter( 'Format::datetime', array(
                'from' => 'Y-m-d H:i:s',
                'to' =>   'm-d-Y g:i A'
            ) )
            ->setFormatter( 'Format::datetime', array(
                'from' => 'm-d-Y g:i A',
                'to' =>   'Y-m-d H:i:s'
            ) )
	)
	->process( $_POST )
	->json();
