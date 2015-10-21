/*
 _____                             _   _____  _   _            _ _   _       _____ _____ _____ 
/  __ \                           | | / __  \| | | |          | | | | |     |  __ \_   _/  ___|
| /  \/ ___  _ __  _ __   ___  ___| |_`' / /'| |_| | ___  __ _| | |_| |__   | |  \/ | | \ `--. 
| |    / _ \| '_ \| '_ \ / _ \/ __| __| / /  |  _  |/ _ \/ _` | | __| '_ \  | | __  | |  `--. \
| \__/\ (_) | | | | | | |  __/ (__| |_./ /___| | | |  __/ (_| | | |_| | | | | |_\ \_| |_/\__/ /
 \____/\___/|_| |_|_| |_|\___|\___|\__\_____/\_| |_/\___|\__,_|_|\__|_| |_|  \____/\___/\____/ 
  
*/

var chart_obj = {
	health: {
		measurements: {
			chart: null,
			data: null,
			options: null
		}
	},
	broadband: {
		num_providers: {
			chart: null,
			data: null,
			options: null
		},
		dl_tiers: {
			chart: null,
			data: null,
			options: null
		},
		ul_tiers: {
			chart: null,
			data: null,
			options: null
		}
	},
	population: {
		gender: {
			chart: null,
			data: null,
			options: null
		}	
	}	
};

function createCharts() {
	
	//console.log(' createCharts cur_tab : ' +  cur_tab );
	
	if (cur_tab == 'health'){	

		chart_obj.health.measurements.data = {
			labels: ["Obesity", "Diabetes", "Smoking", "Excessive Drinking", "Physical Inactivity", "Severe Housing"],
			datasets: [
				{
					label: "Health Behaviours",
					fillColor: "rgba(220,220,220,0.2)",
					strokeColor: "rgba(186,12,12,0.5)",
					pointColor: "rgba(186,12,12,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [geo_prop.adult_obesity_pct, geo_prop.diabetes_pct, geo_prop.smoking_pct, geo_prop.drinking_pct, geo_prop.physical_inactivity, geo_prop.severe_housing_problems]
				}
			]
		};
		
		chart_obj.health.measurements.options = {
			tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value.toFixed(1) %>%",
			legendTemplate : '<ul class="<%=name.toLowerCase()%>-legends" style="width: 100%; list-style-type: none;"><% for (var i=0; i<datasets.length; i++){%><li><div style="background-color:<%=datasets[i].strokeColor%>; width: 20px; height: 2px; display: inline-block; margin: 4px 0;"></div>&nbsp;<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
		};

		if (chart_obj.health.measurements.chart) {
			chart_obj.health.measurements.chart.destroy();
		}
		chart_obj.health.measurements.chart = new Chart(document.getElementById('ch-canvas-health-1').getContext('2d')).Radar(chart_obj.health.measurements.data, chart_obj.health.measurements.options);		
		
		$('#ch-legend-health-1').html( chart_obj.health.measurements.chart.generateLegend() );	
		
	}	
	else if (cur_tab == 'broadband'){
			
		var current_slide = $('.carousel-inner div.active').index() + 1;
		
		//console.log(' current_slide : ' + current_slide );	
		
		if (chart_obj.broadband.dl_tiers.chart) {
			chart_obj.broadband.dl_tiers.chart.destroy();
		}
		if (chart_obj.broadband.num_providers.chart) {
			chart_obj.broadband.num_providers.chart.destroy();
		}
		
		// ***********************************************************
		// chart - Download Tiers
		
		if (current_slide == 2) {
		
			chart_obj.broadband.dl_tiers.data = [
			   {
				  value: geo_prop.advdl_gr768k_lt1500k,
				  label: '0.768 - 1.5',
				  color: '#919190'
			   },
			   {
				  value: geo_prop.advdl_gr1500k_lt3000k,
				  label: '1.5 - 3',
				  color: '#dcdcc6'
			   },
			   {
				  value: geo_prop.advdl_gr3000k_lt6000k,
				  label: '3 - 6',
				  color: '#baf200'
			   },
			   {
				  value: geo_prop.advdl_gr6000k_lt10000k,
				  label: '6 - 10',
				  color: '#baf200'
			   },
			   {
				  value: geo_prop.advdl_gr10000k_lt25000k,
				  label: '10 - 25',
				  color: '#5ae200'
			   },
			   {
				  value: geo_prop.advdl_gr25000k_lt50000k,
				  label: '25 - 50',
				  color: '#0bb81d'
			   },
			   {
				  value: geo_prop.advdl_gr50000k_lt100000k,
				  label: '50 - 100',
				  color: '#00807a'
			   },
			   {
				  value: geo_prop.advdl_gr100000k_lt1gig,
				  label: '100 - 1,000',
				  color: '#0050cc'
			   }
			];
			
			chart_obj.broadband.dl_tiers.options = {
				animationEasing: 'easeOutQuart',
				tooltipTemplate: '<%=label%>: <%= Number(value).toLocaleString() %>%',
				//legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
			};

			if (chart_obj.broadband.dl_tiers.chart) {
				chart_obj.broadband.dl_tiers.chart.destroy();
			}
			chart_obj.broadband.dl_tiers.chart = new Chart(document.getElementById('ch-canvas-broadband-2').getContext('2d')).Doughnut(chart_obj.broadband.dl_tiers.data, chart_obj.broadband.dl_tiers.options);		
			
			 $('#ch-legend-broadband-2').html( 'Download Speed Tiers' );
		}
		
		// ***********************************************************
		// chart - Upload Tiers
		
		if (current_slide == 3) {
		
			chart_obj.broadband.ul_tiers.data = [
			   {
				  value: geo_prop.advul_gr768k_lt1500k,
				  label: '0.768 - 1.5',
				  color: '#919190'
			   },
			   {
				  value: geo_prop.advul_gr1500k_lt3000k,
				  label: '1.5 - 3',
				  color: '#dcdcc6'
			   },
			   {
				  value: geo_prop.advul_gr3000k_lt6000k,
				  label: '3 - 6',
				  color: '#baf200'
			   },
			   {
				  value: geo_prop.advul_gr6000k_lt10000k,
				  label: '6 - 10',
				  color: '#baf200'
			   },
			   {
				  value: geo_prop.advul_gr10000k_lt25000k,
				  label: '10 - 25',
				  color: '#5ae200'
			   },
			   {
				  value: geo_prop.advul_gr25000k_lt50000k,
				  label: '25 - 50',
				  color: '#0bb81d'
			   },
			   {
				  value: geo_prop.advul_gr50000k_lt100000k,
				  label: '50 - 100',
				  color: '#00807a'
			   },
			   {
				  value: geo_prop.advul_gr100000k_lt1gig,
				  label: '100 - 1,000',
				  color: '#0050cc'
			   }
			];
			
			chart_obj.broadband.ul_tiers.options = {
				animationEasing: 'easeOutQuart',
				tooltipTemplate: '<%=label%>: <%= Number(value).toLocaleString() %>%',
				//legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
			};

			if (chart_obj.broadband.ul_tiers.chart) {
				chart_obj.broadband.ul_tiers.chart.destroy();
			}
			chart_obj.broadband.ul_tiers.chart = new Chart(document.getElementById('ch-canvas-broadband-3').getContext('2d')).Doughnut(chart_obj.broadband.ul_tiers.data, chart_obj.broadband.ul_tiers.options);		
			
			 $('#ch-legend-broadband-3').html( 'Upload Speed Tiers' );
		}
		
		// ***********************************************************
		// chart - Number of Providers
		
		if (current_slide == 1) {
		
			chart_obj.broadband.num_providers.data = {
				labels: ["> 1", "> 2", "> 3", "> 4", "> 5", "> 6", "> 7", "> 8"],
				datasets: [
					{
						label: "Number of Providers",
						fillColor: "rgba(220,220,220,0.4)",
						strokeColor: "rgba(0,80,204,1)",
						pointColor: "rgba(0,80,204,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: [geo_prop.prov_gr1, geo_prop.prov_gr2, geo_prop.prov_gr3, geo_prop.prov_gr4, geo_prop.prov_gr5, geo_prop.prov_gr6, geo_prop.prov_gr7, geo_prop.prov_gr8]
					}
				]
			};
			
			chart_obj.broadband.num_providers.options = {
				//bezierCurve: false
				pointHitDetectionRadius : 0,		
				datasetFill : true,
				scaleBeginAtZero: true,
				tooltipTemplate: "<%if (label){%>Number of Providers <%=label%>: <%}%><%= value.toFixed(1) %>%",
				legendTemplate : '<ul class="<%=name.toLowerCase()%>-legends" style="width: 100%; list-style-type: none;"><% for (var i=0; i<datasets.length; i++){%><li><div style="background-color:<%=datasets[i].strokeColor%>; width: 20px; height: 2px; display: inline-block; margin: 4px 0;"></div>&nbsp;<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
				
			};

			if (chart_obj.broadband.num_providers.chart) {
				chart_obj.broadband.num_providers.chart.destroy();
			}		
			
			chart_obj.broadband.num_providers.chart = new Chart(document.getElementById('ch-canvas-broadband-1').getContext('2d')).Line(chart_obj.broadband.num_providers.data, chart_obj.broadband.num_providers.options);		

			 $('#ch-legend-broadband-1').html( chart_obj.broadband.num_providers.chart.generateLegend() );		
		}		
	}
	else if (cur_tab == 'population'){		
		
		chart_obj.population.gender.data = [
		   {
			  value: geo_prop.male_total,
			  label: 'Male',
			  color: '#05ad28'
		   },
		   {
			  value: geo_prop.female_total,
			  label: 'Female',
			  color: '#fffc1e'
		   }				   
		];
		
		chart_obj.population.gender.options = {
			animationEasing: 'easeOutQuart',
			tooltipTemplate: '<%=label%>: <%= value.toLocaleString() %> (<%= Math.round(circumference / 6.283 * 1000) / 10 %>%)',
			legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
		};

		if (chart_obj.population.gender.chart) {
			chart_obj.population.gender.chart.destroy();
		}
		chart_obj.population.gender.chart = new Chart(document.getElementById('ch-canvas-population-1').getContext('2d')).Doughnut(chart_obj.population.gender.data, chart_obj.population.gender.options);		
		
		 $('#ch-legend-population-1').html( chart_obj.population.gender.chart.generateLegend() );	
	}
}
  