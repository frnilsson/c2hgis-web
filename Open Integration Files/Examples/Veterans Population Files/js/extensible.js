/*
 _____                             _   _____  _   _            _ _   _       _____ _____ _____ 
/  __ \                           | | / __  \| | | |          | | | | |     |  __ \_   _/  ___|
| /  \/ ___  _ __  _ __   ___  ___| |_`' / /'| |_| | ___  __ _| | |_| |__   | |  \/ | | \ `--. 
| |    / _ \| '_ \| '_ \ / _ \/ __| __| / /  |  _  |/ _ \/ _` | | __| '_ \  | | __  | |  `--. \
| \__/\ (_) | | | | | | |  __/ (__| |_./ /___| | | |  __/ (_| | | |_| | | | | |_\ \_| |_/\__/ /
 \____/\___/|_| |_|_| |_|\___|\___|\__\_____/\_| |_/\___|\__,_|_|\__|_| |_|  \____/\___/\____/ 
  
*/


function applyNewFilter(filter,type,in_layers,in_styles,geo_host,geo_space,wms_method,zindex){
var extsfilter=getExtPopFilter();

var incrementer=0;

function applyFilter(filter_n){
	console.log("filter_n: "+filter_n);	
	console.log("map_overlays['in_'+ type].length: "+map_overlays['in_'+ type].length);
	map_overlays['in_'+ type][map_overlays['in_'+ type].length] = L.tileLayer.wms( geo_host + '/' + geo_space + '/' + wms_method +'?', {
		 format: 'image/png',
		 transparent: true,
		 cql_filter: filter_n,
		 layers: in_layers,
		 styles: in_styles,
	 }).setZIndex(zindex).addTo(map);
	 this.map.whenReady(function(){
		if(incrementer<extsfilter.length){
			incrementer=incrementer+100;
			applyFilter(filter.split(";")[0]+" AND " +"geography_id"+" IN "+ "("+extsfilter.slice(incrementer,incrementer+100)+")"+";"+filter.split(";")[1]+" AND " +"geography_id"+" IN "+ "("+extsfilter.slice(incrementer,incrementer+100)+")");
		};	 
	 });	 
}

function makeFilterString(filterarray){
	var thisFilterString;
	console.log("filterarray: "+filterarray);
	for(i=0;i<filterarray.length;i++){
		if(i != 0){
			thisFilterString=thisFilterString+","+"'"+filterarray[i]+"'";
		}else{
			thisFilterString="'"+filterarray[i]+"'";
		};
	};
	return thisFilterString;
}

if(extsfilter != null){
	applyFilter(filter.split(";")[0]+" AND " +"geography_id"+" IN "+ "("+extsfilter.slice(incrementer,incrementer+100)+")"+";"+filter.split(";")[1]+" AND " +"geography_id"+" IN "+ "("+extsfilter.slice(incrementer,incrementer+100)+")");
}else{
	map_overlays['in_'+ type][map_overlays['in_'+ type].length] = L.tileLayer.wms( geo_host + '/' + geo_space + '/' + wms_method +'?', {
		 format: 'image/png',
		 transparent: true,
		 cql_filter: filter,
		 layers: in_layers,
		 styles: in_styles,
	 }).setZIndex(zindex).addTo(map);
};
}

function getExtPopFilter(){
	var thisExtPop_sel=$("#ov-select-extend").val();
	console.log("thisExtPop_sel: "+thisExtPop_sel);

	if(thisExtPop_sel) {
		var _extsFilter=[];
		thisExtPop_sel=thisExtPop_sel+"";
		var selection =  thisExtPop_sel.split('$');
		var data_column=selection[0];
		var thisExtPopRange = selection[1].split('_');
		var low = thisExtPopRange[0];
		var high = thisExtPopRange[1];
		console.log("thisExtPopRange: "+thisExtPopRange);
		var extsFilter;
		var started=0;
		for (var key in extsdata ) {
			if (extsdata .hasOwnProperty(key)) {
				if (thisExtPopRange[0]<extsdata [key][data_column] && extsdata [key][data_column]<thisExtPopRange[1]){
					if(started==1){
						extsFilter=extsFilter+",'" + extsdata [key]["countyFIPS"]+"'";
						_extsFilter[_extsFilter.length]="'" + extsdata [key]["countyFIPS"]+"'";
					}else{
						extsFilter="'"+extsdata [key]["countyFIPS"]+"'";
						_extsFilter[0]=extsFilter;
						started=1;
					}
				}
			};
		};
		console.log("_extsFilter: "+_extsFilter);	
		return _extsFilter;			
	}else{
		return null;
	}
};
