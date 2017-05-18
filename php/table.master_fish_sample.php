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
Editor::inst( $db, 'master_fish_sample', array('basin', 'location', 'rivmile','coll_date','fish_genspecies') )
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
            ) ),
		Field::inst( 'fish_common' ),
		Field::inst( 'fish_genspecies' )
	)
	->process( $_POST )
	->json();
