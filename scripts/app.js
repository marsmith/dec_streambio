// ------------------------------------------------------------------------------
// ----- NY QW Mapper ----------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 Martyn Smith - USGS NY WSC

// authors:  Martyn J. Smith - USGS NY WSC

// purpose:  Web Mapping interface for NY QW data

// updates:
// 12.02.2016 mjs - Created

//config variables
var MapX = '-76.2';
var MapY = '42.7';
var map;
// var table, editor;
var masterGeoJSON,curGeoJSONlayer;
var sitesLayer;  //leaflet feature group representing current filtered set of sites
var layer, layerLabels;
var visibleLayers = [];
var identifiedFeature;
var filterSelections = [];
var popupItems = ['SNAME','STAID','MAJRIVBAS','WELLUSE','WELLCOMPIN','CNTY','GUNIT','HUNIT'];
var GeoFilterGroupList = [
	{layerName: "County", dropDownID: "CNTY"},
	{layerName: "Major River Basin", dropDownID: "MAJRIVBAS"},
	{layerName: "Hydrologic Unit", dropDownID: "HUC8"},
	{layerName: "Well Use", dropDownID: "WELLUSE"},
	{layerName: "Well Type", dropDownID: "WELLCOMPIN"},
	{layerName: "Congressional District", dropDownID: "CONGDIST"},
	{layerName: "Senate District", dropDownID: "SENDIST"},
	{layerName: "Assembly District", dropDownID: "ASSEMDIST"},
	{layerName: "NY WSC Sub-district", dropDownID: "NYWSCDIST"}
];

var layerList = [
	{layerID: "0", layerName: "NY WSC Sub-district", outFields: ["subdist","FID"],dropDownID: "WSCsubDist"},
	{layerID: "1", layerName: "Senate District", outFields: ["NAMELSAD","FID","Rep_Name"],dropDownID: "SenateDist"},
	{layerID: "2", layerName: "Assembly District", outFields: ["NAMELSAD","FID","AD_Name"], dropDownID: "AssemDist"},
	{layerID: "3", layerName: "Congressional District",	outFields: ["NAMELSAD","FID","CD_Name"], dropDownID: "CongDist"},
	{layerID: "4", layerName: "County",	outFields: ["County_Nam","FID"],dropDownID: "County"},
	{layerID: "5", layerName: "Hydrologic Unit",	outFields: ["HUC_8","FID","HU_8_Name"],	dropDownID: "HUC8"},
	{layerID: "6", layerName: "Surficial Geology",	outFields: ["FID","MATERIAL"], dropDownID: "SurfGeol"},
	{layerID: "7", layerName: "Bedrock Geology",	outFields: ["FID","MATERIAL"],dropDownID: "BedrockGeol"},
	{layerID: "8", layerName: "NLCD 2011 Land Cover",	outFields: [],	dropDownID: "NLCD11"}	
];

var mapServerDetails =  {
	"url": "https://www.sciencebase.gov/arcgis/rest/services/Catalog/58f63226e4b0f2e20545e5e1/MapServer",
	"layers": [0,1,2,3,4,5,6,7,8], 
	"visible": false, 
	"opacity": 0.8,
};

var tableData = [{
	ajax: 'php/table.master_chemistry.php',
	table: '#master_chemistry',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		}
	]},{
	ajax: 'php/table.master_diatom_sample.php',
	table: '#master_diatom_sample',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		}
	]},{
	ajax: 'php/table.master_diatom_species.php',
	table: '#master_diatom_species',
	fields: [
		{
			label: "Diatom Genus Species:",
			name: "diatom_genspecies"
		},
		{
			label: "Division:",
			name: "division"
		},
		{
			label: "Class:",
			name: "class"
		},
		{
			label: "Order:",
			name: "order"
		},
		{
			label: "Family:",
			name: "family"
		}
	]},{
	ajax: 'php/table.master_field.php',
	table: '#master_field',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		}
	]},{
	ajax: 'php/table.master_fish_sample.php',
	table: '#master_fish_sample',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		},
		{
			label: "Fish Common Name:",
			name: "fish_common"
		},
		{
			label: "Fish Genus Species",
			name: "fish_genspecies"
		}
	]},{
	ajax: 'php/table.master_habitat.php',
	table: '#master_habitat',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		}
	]},{
	ajax: 'php/table.master_lake_assess.php',
	table: '#master_lake_assess',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		}
	]},{
	ajax: 'php/table.master_lake_phab.php',
	table: '#master_lake_phab',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		}
	]},{
	ajax: 'php/table.master_macro_sample.php',
	table: '#master_macro_sample',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		}
	]},{
	ajax: 'php/table.master_macro_species.php',
	table: '#master_macro_species',
	fields: [
		{
			label: "Macro Genus Species:",
			name: "macro_genspecies"
		},
		{
			label: "Phylum:",
			name: "phylum"
		},
		{
			label: "Class:",
			name: "clas"
		},
		{
			label: "Order:",
			name: "ordr"
		},
		{
			label: "Family:",
			name: "family"
		},
		{
			label: "Sub Family:",
			name: "subfamily"
		}
	]},{
	ajax: 'php/table.master_pebble_count.php',
	table: '#master_pebble_count',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		}
	]},{
	show: true,
	ajax: 'php/table.master_sites.php',
	table: '#master_sites',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Name:",
			name: "name"
		},
		{
			label: "Latitude:",
			name: "latitude"
		},
		{
			label: "Longitude:",
			name: "longitude"
		}
	]},{
	ajax: 'php/table.master_tissue.php',
	table: '#master_tissue',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		}
	]},{
	ajax: 'php/table.master_userperception.php',
	table: '#master_userperception',
	fields: [
		{
			label: "Basin:",
			name: "basin"
		},
		{
			label: "Location:",
			name: "location"
		},
		{
			label: "River Mile:",
			name: "rivmile"
		},
		{
			label: "Collection Date:",
			name: "coll_date",
			type:      'datetime',
			def:       function () { return new Date(); },
			format:    'MM-DD-YYYY h:mm A',
			fieldInfo: 'US style m-d-y date input with 12 hour clock'
		}
	]},{	
	type: 'query',
	ajax: {
		url: 'php/query.master_macro_sample.php',
		dataSrc : function ( json ) {
			var data = [];
			//console.log('json',json)
			$.each(json.data, function( index, record) {
				//console.log(record)
				if (record.indiv === "2") {
					data.push(record);
				}

			});
			//console.log('data',data);
			return data;
		},
	},
	table: '#query_master_macro_sample',
	columns: [
		{
			data: "basin"
		},
		{
			data: "location"
		},
		{
			data: "rivmile"
		},
		{
			data: "coll_date",
		},
		{
			data: "collect",
		},
		{
			data: "replicate",
		},
		{
			data: "macro_genspecies",
		},
		{
			data: "indiv",
		}	
	],
	searching: false, 
	paging: false,
	}
];


//instantiate map
$( document ).ready(function() {

	//create map
	map = L.map('mapDiv',{zoomControl: false});

	L.Icon.Default.imagePath = './images/';

	//add zoom control with your options
	L.control.zoom({position:'topright'}).addTo(map);  
	L.control.scale().addTo(map);

	//basemap
	layer = L.esri.basemapLayer('DarkGray').addTo(map);

	//set initial view
	map.setView([MapY, MapX], 7);
		
	//define layers
	sitesLayer = L.featureGroup().addTo(map);

	loadSites();
	initializeTables();
	
	/*  START EVENT HANDLERS */
	$('#mobile-main-menu').click(function() {
		$('body').toggleClass('isOpenMenu');
	});

	$('.basemapBtn').click(function() {
		$('.basemapBtn').removeClass('slick-btn-selection');
		$(this).addClass('slick-btn-selection');
		var baseMap = this.id.replace('btn','');
		setBasemap(baseMap);
	});


	$('#aboutButton').click(function() {
		$('#aboutModal').modal('show');
	});	

	$('#exportGeoJSON').click(function() {
		downloadGeoJSON();
	});	

	$('#exportKML').click(function() {
		downloadKML();
	});	

	$('#exportCSV').click(function() {
		downloadCSV();
	});	

	//click listener for regular button
	$('#baseLayerToggles').on("click", '.layerToggle', function(e) {
		var button  = this;
		toggleBaseLayer(e,button);
	});

				
	$('#main-menu').on("click", '.tableSelect', function(e) {
		var buttonID = $(this).attr('id').replace('show_','');

		//on click hide all other tables and show the one clicked
		$(".dataTables_wrapper").each(function(i, table) {
			var tableID = $(table).attr('id');

			$(table).hide();
			
			if (tableID === buttonID + '_wrapper') { 
				$(table).show(); 
			}
		});
	});

	$('.accordion-toggle').click(function() {

		if($(this).attr('href') === '#mapPanel') {
			$('#dataTables').toggle();
			$('#mapDiv').toggle();
			map.invalidateSize();
		}
		else {
			if ($('#dataTables').is(":visible")) return; 
			$('#dataTables').toggle();
			$('#mapDiv').toggle();
		}

	});

	/*  END EVENT HANDLERS */
});

function toggleBaseLayer(e, button) {
	
	var layerID = parseInt($(button).attr('value'));		
	
	//layer toggle
	var visibleLayers = mapServer.getLayers();
	var index = -1;

	//there is something on the map already
	if (visibleLayers) index = visibleLayers.indexOf(layerID);

	//case 1, remove this layer from the map
	if (index > -1) {
		//console.log('map already has this layer: ', layerID);
		visibleLayers.splice(index, 1);

		//if there is nothing in visibleLayers, have to remove the map layer to clear
		if (visibleLayers.length === 0) {
			map.removeLayer(mapServer);
		}

		//otherwise just set to the current list
		else {
			mapServer.setLayers(visibleLayers);
		}
		
		//console.log('current visible layers: ', visibleLayers);	
		$(button).removeClass('slick-btn-selection');
	} 
	
	//case 2, add this layer to existing layers
	else {
		//console.log('map DOES NOT have this layer: ', layerID);
		$(button).addClass('slick-btn-selection');
		visibleLayers.push(layerID);
		mapServer.setLayers(visibleLayers);
		//map.addLayer(mapServer);
		//console.log('current visible layers: ', visibleLayers);
	}
}

function initializeTables() {

	//loop over and create tables
	$.each(tableData, function( index, table ) {
		//console.log(table)
		var tableName = table.table.replace('#','');
		var tableTitle = toTitleCase(tableName.replace('master_','').replace('_',' '));

		//add table structure to dom
		$('#dataTables').append('<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered " id="' + tableName + '" ><thead></thead></table>');	

		//check table type
		if (table.type == 'query') {
			//add button to sidebar
			$('#queryList').append('<button type="button" class="btn btn-success btn-block tableSelect" id="show_' + tableName + '" >' + tableTitle + '</button>');

			var headerRow = '<tr>';
			$.each(table.columns, function( index, field ) {
				headerRow += '<th>' + field.data + '</th>';
			});
			headerRow += '</tr>';
			$(table.table + ' thead').append(headerRow);

			createQuery(table);
		}
		else {
			//add button to sidebar
			$('#tableList').append('<button type="button" class="btn btn-success btn-block tableSelect" id="show_' + tableName + '" >' + tableTitle + '</button>');

			//add table header for each field
			var headerRow = '<tr>';
			$.each(table.fields, function( index, field ) {
				headerRow += '<th>' + field.label.replace(':','') + '</th>';
			});
			headerRow += '</tr>';
			$(table.table + ' thead').append(headerRow);

			//create datatables
			createTable(table);	
		}
	});
}

function createQuery(tableInfo) {

	//initialized datatables
	var table = $(tableInfo.table).DataTable(tableInfo);
	
	//setup buttons
	new $.fn.dataTable.Buttons( table, {
		buttons: [{
			extend: 'csv',
			text: 'Export BAP to CSV'
		}]
	} );

	table.buttons().container()
		.appendTo( $('.col-sm-6:eq(0)', table.table().container() ) );

	//hide all other tables
	if (!tableInfo.show) $(tableInfo.table + '_wrapper').hide();
}

function createTable(tableInfo) {
	//initialize datatables editor
	var editor = new $.fn.dataTable.Editor(tableInfo);

	//initialized datatables
	var table = $(tableInfo.table).DataTable( {
		ajax: tableInfo.ajax,
		columns: $.map(tableInfo.fields, function(field) {
			return {data:field.name};
		}),
		select: true,
		lengthChange: false
	} );
	
	//setup buttons
	new $.fn.dataTable.Buttons( table, [
		{ extend: "create", editor: editor },
		{ extend: "edit",   editor: editor },
		{ extend: "remove", editor: editor }
	] );

	new $.fn.dataTable.Buttons( table, {
		buttons: [
			'copy', 'csv', 'excel', 'pdf'
		]
	} );

	table.buttons().container()
		.appendTo( $('.col-sm-6:eq(0)', table.table().container() ) );

	// editor.on( 'edit', function ( e, json, data ) {
	// 	loadSites();
	// 	createPopup([data.latitude,data.longitude],data);
	// });

	
	// table.on( 'select', function ( e, dt, type, indexes ) {
	// 	var rowData = table.rows( indexes ).data().toArray()[0];

	// 	sitesLayer.eachLayer(function(layer){
	// 		//console.log(layer._layers);
	// 		$.each(layer._layers, function( index, value ) {
	// 			//console.log( value.feature.properties);
	// 			if (rowData.id == value.feature.properties.id) {
	// 				createPopup([value.feature.properties.latitude,value.feature.properties.longitude],value.feature.properties);
	// 			}
	// 		});
	// 	});
	// });

	// table.on( 'deselect', function ( e, dt, type, indexes ) {
	// 	map.closePopup();
	// });

	//hide all other tables
	if (!tableInfo.show) $(tableInfo.table + '_wrapper').hide();

	//show file upload button
	$(tableInfo.table + '_wrapper').append('upload a CSV <input type="file" accept=".csv" id="fileinput_' + tableInfo.table.replace('#','') + '" />');

	//fileinput listener for upload parsing
	$('#fileinput_' + tableInfo.table.replace('#','')).on("change", function(evt) {
		var f = evt.target.files[0];
		if (f) {
			var r = new FileReader();
			r.onload = function(e) {
				var data = $.csv.toObjects(e.target.result);
				
				//get this table's keys
				var tableKeys = $.map(tableInfo.fields, function(field) {
					return field.name;
				});
				
				//get CSV keys
				var CSVkeys = Object.keys(data[0]);

				//some simple validation--first make sure keys match whats in the table
				if(tableKeys.sort().join(',') !== CSVkeys.sort().join(',')){
					alert('CSV contains needs to contain a header row with the following fields: ' + tableKeys.join(','));
					return;
				}

				//create temp data object for storing to DB using format for datatables editor 'multiSet'
				//https://editor.datatables.net/reference/api/multiSet()
				var objData = {};
				$.each(CSVkeys, function(index, key) {
					objData[key] = {};
				});

				//create editor instance with a length of the incoming data
				editor.create(data.length, false);

				//loop over rows to populate data object
				$.each(data, function(index, row) {
					$.each(row, function(field, value) {
						objData[field][index] = value;
					});				
				});

				//set the values
				editor.multiSet(objData).submit()
					//check for errors
					.on( 'submitComplete', function (e, json, data) {
						console.log('submitComplete:',e, json, data);

						//one possibility is SQL error, IE. duplicate entries also exist:
						if (json.error) {
							console.error("There was a problem submmiting the data: " + json.error);
							alert("There was a problem submmiting the data: " + json.error);
						}
					})
					.on( 'submitError', function (e, xhr, err, thrown, data) {
						console.error('submitError:',e, xhr, err, thrown, data);

						//one possibility is SQL error, IE. duplicate entries also exist:
						if (err) alert("There was a problem submmiting the data: " + err);
					})
					.on( 'submitSuccess', function (e, json, data) {
						console.log('sumbitSuccess:',e, json, data);

						//one possibility is SQL error, IE. duplicate entries also exist:
						if (json) alert("Successfully added to the database");
					});


				//reload the table
				table.ajax.reload();
			};
			r.readAsText(f);
		} else {
			alert("Failed to load file");
		}
	});
}


function loadSites() {
	sitesLayer.clearLayers();

	//toastr.info('Drawing GeoJSON...', {timeOut: 0});
	$.ajax({
		type : "GET",
		url : './php/table.master_sites.php',
		dataType : "json",
		async : false,
		success : function(response){
			//console.log('loaded',response);

			//create empty feature collection
			var geoJSON = {
				"type": "FeatureCollection",
				"features": []
			};

			//loop over sites
			response.data.forEach(function(site) {
				
				//scaffold geojson feature
				var geojsonFeature = {
					"type": "Feature",
					"properties": {},
					"geometry": {
						"type": "Point",
						"coordinates": [ parseFloat(site.longitude), parseFloat(site.latitude)]
					}
				};

				//loop over properties to add to site
				$.each(site, function( key, value ) {
					geojsonFeature.properties[key] = value;
				});

				//push individual site to geoJSON feature collection
				geoJSON.features.push(geojsonFeature);
	
			});

			var geoJSONlayer = L.geoJSON(geoJSON)
				.on('click', function(e) { 
					createPopup(e.latlng,e.layer.feature.properties);

					//also select row from table
					// table.rows().deselect();
					// table.row('#' + e.layer.feature.properties.DT_RowId).select();

				});


			//add to sitesLayer (already on map)
			sitesLayer.addLayer(geoJSONlayer);
		}
	});
}

function createPopup(latlng,properties) {
	//create popup content
	var $popupContent = $('<div>', { id: 'popup' });
	
	$.each(properties, function( index, property ) {
		if (index.length > 0 && property.length > 0) {
			$popupContent.append('<b>' + index + ':</b>  ' + property + '</br>')
		}
	});

	//open popup at clicked point
	var popup = L.popup({autoPan: false})
		.setLatLng(latlng)
		.setContent($popupContent.html())
		.openOn(map);
}

function downloadGeoJSON() {

	//for some reason the leaflet toGeoJSON wraps the geojson in a second feature collection
	if (sitesLayer.toGeoJSON().features[0]) {
		var GeoJSON = JSON.stringify(sitesLayer.toGeoJSON().features[0]);
		var filename = 'data.geojson';
		downloadFile(GeoJSON,filename)
	}
	else {
		//toastr.error('Error', 'No sites to export', {timeOut: 0})
	}
}

function downloadKML() {
	//https://github.com/mapbox/tokml
	//https://gis.stackexchange.com/questions/159344/export-to-kml-option-using-leaflet
	var geojson = sitesLayer.toGeoJSON();

	if (geojson.features[0]) {
		var GeoJSON = geojson.features[0];
		var kml = tokml(GeoJSON);
		var filename = 'data.kml';
		downloadFile(kml,filename);
	}
	else {
		//toastr.error('Error', 'No sites to export', {timeOut: 0})
	}
}

function downloadCSV() {
	var geojson = sitesLayer.toGeoJSON().features[0];

    if (geojson) {
		//get headers
        var attributeNames = Object.keys(geojson.features[0].properties);

        // write csv file
        var csvData = [];
        csvData.push(attributeNames.join(','));

        geojson.features.forEach(function(feature) {
            var attributes = [];
            attributeNames.forEach(function(name) {
                attributes.push((feature.properties[name].toString()));
            });
            csvData.push(attributes);
        });

        csvData = csvData.join('\n');

        var filename = 'data.csv';
		downloadFile(csvData,filename);
	}

	else {
		//toastr.error('Error', 'No sites to export', {timeOut: 0})
	}

}

function downloadFile(data,filename) {
	var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, filename);
	} else {
		var link = document.createElement('a');
		var url = URL.createObjectURL(blob);
		if (link.download !== undefined) { // feature detection
			// Browsers that support HTML5 download attribute
			link.setAttribute('href', url);
			link.setAttribute('download', filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
		else {
			window.open(url);
		}
	}
}

function setBasemap(basemap) {
	if (layer) {
		map.removeLayer(layer);
	}

	layer = L.esri.basemapLayer(basemap);

	map.addLayer(layer);

	if (layerLabels) {
		map.removeLayer(layerLabels);
	}

	if (basemap === 'ShadedRelief'
		|| basemap === 'Oceans'
		|| basemap === 'Gray'
		|| basemap === 'DarkGray'
		|| basemap === 'Imagery'
		|| basemap === 'Terrain'
	) {
		layerLabels = L.esri.basemapLayer(basemap + 'Labels');
		map.addLayer(layerLabels);
	}
}

function resetFilters() {
	$('.selectpicker').selectpicker('deselectAll');

	parentArray = [];
	filterSelections = [];
}

function resetView() {

	//reset filters
	resetFilters();

	//reset view
	map.setView([MapY, MapX], 7);
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}