/*
 _____                             _   _____  _   _            _ _   _       _____ _____ _____ 
/  __ \                           | | / __  \| | | |          | | | | |     |  __ \_   _/  ___|
| /  \/ ___  _ __  _ __   ___  ___| |_`' / /'| |_| | ___  __ _| | |_| |__   | |  \/ | | \ `--. 
| |    / _ \| '_ \| '_ \ / _ \/ __| __| / /  |  _  |/ _ \/ _` | | __| '_ \  | | __  | |  `--. \
| \__/\ (_) | | | | | | |  __/ (__| |_./ /___| | | |  __/ (_| | | |_| | | | | |_\ \_| |_/\__/ /
 \____/\___/|_| |_|_| |_|\___|\___|\__\_____/\_| |_/\___|\__,_|_|\__|_| |_|  \____/\___/\____/ 
  
*/

var insight_ly = {
	broadband: {
		in_bb_access: {
			column: 'pctpopwbbacc',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 99,
			step: 5,
			values: [90, 100],
			label: '% Coverage',
			tooltip: 'Percent of population with access to fixed broadband service at 25/3 mbps or higher advertised speeds.',
			name: 'Broadband Access',
			suffix: '%'
		},	
		in_bb_rural_access: {
			column: 'bpr_ruralpctwaccess',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 99,
			step: 5,
			values: [90, 100],
			label: '% Coverage',
			tooltip: 'Percent of rural population with access to fixed broadband service at 25/3 mbps or higher advertised speeds.',
			name: 'Rural Access',
			suffix: '%'
		},
		in_bb_in_adoption: {
			column: 'res_concxns_pct',
			unit: 'perc',
			min: 0,
			max: 5,
			multiple: 20,
			zindex: 99,
			step: 1,
			values: [4, 5],
			label: '% Coverage',
			tooltip: 'Percent of households with fixed connections over 200 kbps.',
			name: 'Internet Adoption',
			suffix: '%'
		},		
		in_bb_wn_access: {
			column: 'wireline_advdl_gr25000k',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 99,
			step: 5,
			values: [75, 100],
			label: '% Coverage',
			tooltip: 'Percent of population with access to 25 mbps advertised wireline download speeds.',
			name: 'Wireline Access',
			suffix: '%'
		},
		in_bb_ws_access: {
			column: 'wireless_advdl_gr25000k',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 99,
			step: 5,
			values: [75, 100],
			label: '% Coverage',
			tooltip: 'Percent of population with access to 25 mbps advertised wireless download speeds.',
			name: 'Wireless Access',
			suffix: '%'
		},
		in_bb_dl_speed: {
			column: 'dl_tiers',
			unit: 'st',
			min: 6,
			max: 10,
			multiple: 1,
			zindex: 99,
			step: 1,
			values: [9, 10],
			label: 'Download',
			tooltip: 'Most commonly advertised maximum download speed.',
			name: 'Download Speed',
			suffix: 'mbps'
		},
		in_bb_ul_speed: {
			column: 'ul_tiers',
			unit: 'st',
			min: 1,
			max: 10,
			multiple: 1,
			zindex: 99,
			step: 1,
			values: [9, 10],
			label: 'Upload',
			tooltip: 'Most commonly advertised maximum upload speed.',
			name: 'Upload Speed',
			suffix: 'mbps'
		}		
	},
	health: {
		in_pcp_access: {
			column: 'pcp_per_capita',
			unit: 'p100000',
			min: 0,
			max: 0.002,
			multiple: 100000,
			zindex: 90,
			step: 0.00005,
			values: [0.00000, 0.00070],
			label: ' Physicians',
			tooltip: 'Primary Care Physicians per 100,000 people.',
			name: 'Physician Access',
			suffix: 'per 100,000'
		},
		in_prm_death: {
			column: 'years_lost_per_100000',
			unit: 'y100000',
			min: 2500,
			max: 20000,
			multiple: 1,
			zindex: 90,
			step: 100,
			values: [7500, 15000],
			label: ' Years',
			tooltip: 'Number of years lost due to premature death before age 75 per 100,000 people.',
			name: 'Premature Death',
			suffix: 'per 100,000'
		},
		in_prv_hosp: {
			column: 'preventable_hospital_stays_per_1000',
			unit: 'p1000',
			min: 0,
			max: 150,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [60, 150],
			label: ' Hospital Stays',
			tooltip: 'Number of preventable hospital stays per 1,000 people.',
			name: 'Preventable Hospital',
			suffix: 'per 1,000'
		},
		in_inj_death: {
			column: 'injury_deaths_per_100000',
			unit: 'p1000000',
			min: 0,
			max: 200,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [70, 100],
			label: ' Injury Deaths',
			tooltip: 'Number of deaths due to injury per 100,000 population.',
			name: 'Injury Deaths',
			suffix: 'per 100,000'
		},
		in_sick_days: {
			column: 'poor_physical_health_days_within_last_30_days',
			unit: 'days',
			min: 1,
			max: 10,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [4, 10],
			label: ' Sick Days',
			tooltip: 'Average number of physically unhealthy days reported in past 30 days (age-adjusted).',
			name: 'Sick Days',
			suffix: 'days'
		},
		in_obs_rate: {
			column: 'adult_obesity_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [30, 50],
			label: '% Obesity',
			tooltip: 'Percentage of adults that report a BMI of 30 or more.',
			name: 'Obesity Rate',
			suffix: '%'
		},
		in_long_commute: {
			column: 'long_commute_driving_alone',
			unit: 'perc',
			min: 0,
			max: 70,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [35, 50],
			label: '% Commuters',
			tooltip: 'Among workers who commute in their car alone, the percentage that commute more than 30 minutes.',
			name: 'Long Commute',
			suffix: '%'
		},
		in_driving_alone: {
			column: 'driving_alone_to_work',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [80, 100],
			label: '% Alone',
			tooltip: 'Percentage of the workforce that drives alone to work.',
			name: 'Driving Alone',
			suffix: '%'
		},
		in_diabetes_rate: {
			column: 'diabetes_pct',
			unit: 'perc',
			min: 0,
			max: 20,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [0, 20],
			label: '% Diabetes',
			tooltip: 'Percentage of adults with diabetes.',
			name: 'Diabetes Rate',
			suffix: '%'
		},
		in_smoking_rate: {
			column: 'smoking_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [20, 50],
			label: '% Smoking',
			tooltip: 'Percentage of adults who are current smokers.',
			name: 'Smoking Rate',
			suffix: '%'
		},
		in_drinking_rate: {
			column: 'drinking_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [15, 50],
			label: '% Drunk',
			tooltip: 'Percentage of adults reporting binge or heavy drinking.',
			name: 'Excessive Drinking',
			suffix: '%'
		},
		in_phys_inactivity: {
			column: 'physical_inactivity',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [25, 50],
			label: '% Inactive',
			tooltip: 'Percentage of adults aged 20 and over reporting no leisure-time physical activity.',
			name: 'Physical Inactivity',
			suffix: '%'
		},
		in_severe_housing: {
			column: 'severe_housing_problems',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [20, 50],
			label: '% Severe',
			tooltip: 'Percentage of households with at least 1 of 4 housing problems: overcrowding, high housing costs, or lack of kitchen or plumbing facilities.',
			name: 'Severe Housing',
			suffix: '%'
		},
		in_poorfair: {
			column: 'poor_fair_health_pct',
			unit: 'perc',
			min: 0,
			max: 40,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [16, 40],
			label: '% Poor/Fair',
			tooltip: 'Percentage of adults reporting fair or poor health (age-adjusted).',
			name: 'Poor/Fair Health',
			suffix: '%'			
		}
	},	
	opioid: {
		in_alldrugs_age_adj_mortality_rate: {
			column: 'alldrugs_age_adj_mortality_rate',
			unit: 'perc',
			min: 4,
			max: 116,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [0, 20],
			label: ' Deaths',
			tooltip: 'Mortality Rate from All Drug Overdoses per 100,000 people.',
			name: 'All Drugs Mortality Rate',
			suffix: '%'
		},
		in_alldrugs_age_adj_mortality_rate_pct_change: {
			column: 'alldrugs_age_adj_mortality_rate',
			unit: 'perc',
			min: -43,
			max: 416,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [100, 200],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from All Drug Overdoses per 100,000 people.',
			name: 'All Drugs Mortality Rate',
			suffix: '%'
		},
		in_anyopioids_age_adj_mortality_rate: {
			column: 'anyopioids_age_adj_mortality_rate',
			unit: 'perc',
			min: 1,
			max: 105,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [0, 20],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Any Opiods Overdoses per 100,000 people.',
			name: 'Any Opioids Mortality Rate',
			suffix: '%'
		},
		in_anyopioids_age_adj_mortality_rate_pct_change: {
			column: 'anyopioids_age_adj_mortality_rate_pct_change',
			unit: 'perc',
			min: -52,
			max: 761,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [100, 200],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Any Drug Overdoses per 100,000 people.',
			name: 'Any Opioids Mortality Rate',
			suffix: '%'
		},
		in_syntheticopioids_age_adj_mortality_rate: {
			column: 'syntheticopioids_age_adj_mortality_rate',
			unit: 'perc',
			min: 0,
			max: 37,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [0, 20],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Synthetic Opiods Overdoses per 100,000 people.',
			name: 'Synthetic Opioids Mortality Rate',
			suffix: '%'
		},
		in_syntheticopioids_age_adj_mortality_rate_pct_change: {
			column: 'syntheticopioids_age_adj_mortality_rate_pct_change',
			unit: 'perc',
			min: -20,
			max: 2619,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [100, 500],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Synthetic Drug Overdoses per 100,000 people.',
			name: 'Synthetic Opioids Mortality Rate',
			suffix: '%'
		},
		in_prescriptionopioids_age_adj_mortality_rate: {
			column: 'prescriptionopioids_age_adj_mortality_rate',
			unit: 'perc',
			min: 1,
			max: 96,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [0, 20],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Prescription Opioids Overdoses per 100,000 people.',
			name: 'Prescription Opioids Mortality Rate',
			suffix: '%'
		},
		in_prescriptionopioids_age_adj_mortality_rate_pct_change: {
			column: 'prescriptionopioids_age_adj_mortality_rate_pct_change',
			unit: 'perc',
			min: -62,
			max: 367,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [100, 500],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Prescription Opioids Overdoses per 100,000 people.',
			name: 'Prescription Opioids Mortality Rate',
			suffix: '%'
		},
		in_heroin_age_adj_mortality_rate: {
			column: 'heroin_age_adj_mortality_rate',
			unit: 'perc',
			min: 0.3,
			max: 57,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [0, 20],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Heroin Overdoses per 100,000 people.',
			name: 'Heroin Mortality Rate',
			suffix: '%'
		},
		in_heroin_age_adj_mortality_rate_pct_change: {
			column: 'heroin_age_adj_mortality_rate_pct_change',
			unit: 'perc',
			min: -31,
			max: 800,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [100, 500],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Heroin Drug Overdoses per 100,000 people.',
			name: 'Heroin Mortality Rate',
			suffix: '%'
		},
		in_opioid_prescribing_rate: {
			column: 'opioid_prescribing_rate',
			unit: 'perc',
			min: 0,
			max: 61,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [0, 20],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Prescribing Opioids Overdoses per 100,000 people.',
			name: 'Prescribing Mortality Rate',
			suffix: '%'
		},
		in_opioid_prescribing_rate_pct_change: {
			column: 'opioid_prescribing_rate_pct_change',
			unit: 'perc',
			min: -100,
			max: 321,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [100, 500],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Prescribing Opioids Overdoses per 100,000 people.',
			name: 'Prescribing Mortality Rate',
			suffix: '%'
		},



		in_obs_rate: {
			column: 'adult_obesity_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [30, 50],
			label: '% Drug Abuse',
			tooltip: 'Percentage of adults with drug abuse.',
			name: 'Drug Abuse Rate',
			suffix: '%'
		},
		in_op_mortality: {
			column: 'pcp_per_capita',
			unit: 'p100000',
			min: 0,
			max: 0.002,
			multiple: 100000,
			zindex: 90,
			step: 0.00005,
			values: [0.00000, 0.00070],
			label: ' Deaths',
			tooltip: 'Number of Deaths from Opioid Overdoses per 100,000 people.',
			name: 'Opioid Mortality',
			suffix: 'per 100,000'
		},
		in_poorfair: {
			column: 'poor_fair_health_pct',
			unit: 'perc',
			min: 0,
			max: 40,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [16, 40],
			label: '% Poor/Fair Mental Health',
			tooltip: 'Percentage of adults reporting fair or poor mental health (age-adjusted).',
			name: 'Poor/Fair Mental Health',
			suffix: '%'			
		},
		in_prm_death: {
			column: 'years_lost_per_100000',
			unit: 'y100000',
			min: 2500,
			max: 20000,
			multiple: 1,
			zindex: 90,
			step: 100,
			values: [7500, 15000],
			label: ' Years',
			tooltip: 'Number of years lost due to premature death before age 75 per 100,000 people.',
			name: 'Premature Death',
			suffix: 'per 100,000'
		},
		in_prv_hosp: {
			column: 'preventable_hospital_stays_per_1000',
			unit: 'p1000',
			min: 0,
			max: 150,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [60, 150],
			label: ' Mental Health Providers',
			tooltip: 'Number of mental health providers per 1,000 people.',
			name: 'Mental Health Providers',
			suffix: 'per 1,000'
		},
		in_sick_days: {
			column: 'poor_physical_health_days_within_last_30_days',
			unit: 'days',
			min: 1,
			max: 10,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [4, 10],
			label: ' Mentally Ill Days',
			tooltip: 'Average number of mentally unhealthy days reported in past 30 days (age-adjusted).',
			name: 'Mentally Ill Days',
			suffix: 'days'
		},
		in_inj_death: {
			column: 'injury_deaths_per_100000',
			unit: 'p1000000',
			min: 0,
			max: 200,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [70, 100],
			label: ' Injury Deaths',
			tooltip: 'Number of deaths due to injury per 100,000 population.',
			name: 'Injury Deaths',
			suffix: 'per 100,000'
		},
		in_long_commute: {
			column: 'long_commute_driving_alone',
			unit: 'perc',
			min: 0,
			max: 70,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [35, 50],
			label: '% Commuters',
			tooltip: 'Among workers who commute in their car alone, the percentage that commute more than 30 minutes.',
			name: 'Long Commute',
			suffix: '%'
		},
		in_driving_alone: {
			column: 'driving_alone_to_work',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [80, 100],
			label: '% Alone',
			tooltip: 'Percentage of the workforce that drives alone to work.',
			name: 'Driving Alone',
			suffix: '%'
		},
		in_smoking_rate: {
			column: 'smoking_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [20, 50],
			label: '% Smoking',
			tooltip: 'Percentage of adults who are current smokers.',
			name: 'Smoking Rate',
			suffix: '%'
		},
		in_drinking_rate: {
			column: 'drinking_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [15, 50],
			label: '% Drunk',
			tooltip: 'Percentage of adults reporting binge or heavy drinking.',
			name: 'Excessive Drinking',
			suffix: '%'
		},
		in_phys_inactivity: {
			column: 'physical_inactivity',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [25, 50],
			label: '% Inactive',
			tooltip: 'Percentage of adults aged 20 and over reporting no leisure-time physical activity.',
			name: 'Physical Inactivity',
			suffix: '%'
		},
		in_severe_housing: {
			column: 'severe_housing_problems',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [20, 50],
			label: '% Severe',
			tooltip: 'Percentage of households with at least 1 of 4 housing problems: overcrowding, high housing costs, or lack of kitchen or plumbing facilities.',
			name: 'Severe Housing',
			suffix: '%'
		}
	},
	bbOpioid: {
		in_alldrugs_age_adj_mortality_rate: {
			column: 'alldrugs_age_adj_mortality_rate',
			unit: '',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: ' Deaths',
			tooltip: 'Mortality Rate from All Drug Overdoses per 100,000 people.',
			name: 'All Drugs Mortality Rate',
			suffix: '%',
			stateMin: 8.1,
			stateMax: 48.9,
			countyMin: 5, 
			countyMax: 135.4
		},
		in_alldrugs_age_adj_mortality_rate_pct_change: {
			column: 'alldrugs_age_adj_mortality_rate',
			unit: '',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from All Drug Overdoses per 100,000 people.',
			name: 'All Drugs Mortality Rate',
			suffix: '%',
			stateMin: -19.23,
			stateMax: 187.21,
			countyMin: -42.34, 
			countyMax: 415.23
		},
		in_anyopioids_age_adj_mortality_rate: {
			column: 'anyopioids_age_adj_mortality_rate',
			unit: '',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Any Opiods Overdoses per 100,000 people.',
			name: 'Any Opioids Mortality Rate',
			suffix: '%',
			stateMin: 3.5,
			stateMax: 42.1,
			countyMin: 1.8, 
			countyMax: 125
		},
		in_anyopioids_age_adj_mortality_rate_pct_change: {
			column: 'anyopioids_age_adj_mortality_rate_pct_change',
			unit: 'perc',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Any Drug Overdoses per 100,000 people.',
			name: 'Any Opioids Mortality Rate',
			suffix: '%',
			stateMin: -39.53,
			stateMax: 309.21,
			countyMin: -51.15, 
			countyMax: 760.26
		},
		in_syntheticopioids_age_adj_mortality_rate: {
			column: 'syntheticopioids_age_adj_mortality_rate',
			unit: '',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Synthetic Opiods Overdoses per 100,000 people.',
			name: 'Synthetic Opioids Mortality Rate',
			suffix: '%',
			stateMin: 0.7,
			stateMax: 17.9,
			countyMin: 0.4, 
			countyMax: 36.8
		},
		in_syntheticopioids_age_adj_mortality_rate_pct_change: {
			column: 'syntheticopioids_age_adj_mortality_rate_pct_change',
			unit: 'perc',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Synthetic Drug Overdoses per 100,000 people.',
			name: 'Synthetic Opioids Mortality Rate',
			suffix: '%',
			stateMin: -20,
			stateMax: 2618.18,
			countyMin: -5.26, 
			countyMax: 958.82
		},
		in_prescriptionopioids_age_adj_mortality_rate: {
			column: 'prescriptionopioids_age_adj_mortality_rate',
			unit: '',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Prescription Opioids Overdoses per 100,000 people.',
			name: 'Prescription Opioids Mortality Rate',
			suffix: '%',
			stateMin: 2.6,
			stateMax: 26.8,
			countyMin: 1, 
			countyMax: 95.3
		},
		in_prescriptionopioids_age_adj_mortality_rate_pct_change: {
			column: 'prescriptionopioids_age_adj_mortality_rate_pct_change',
			unit: 'perc',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Prescription Opioids Overdoses per 100,000 people.',
			name: 'Prescription Opioids Mortality Rate',
			suffix: '%',
			stateMin: -49.55,
			stateMax: 250,
			countyMin: -61.8, 
			countyMax: 366.67
		},
		in_heroin_age_adj_mortality_rate: {
			column: 'heroin_age_adj_mortality_rate',
			unit: '',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Heroin Overdoses per 100,000 people.',
			name: 'Heroin Mortality Rate',
			suffix: '%',
			stateMin: 0.3,
			stateMax: 13.6,
			countyMin: 0.5, 
			countyMax: 56.7
		},
		in_heroin_age_adj_mortality_rate_pct_change: {
			column: 'heroin_age_adj_mortality_rate_pct_change',
			unit: 'perc',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Heroin Drug Overdoses per 100,000 people.',
			name: 'Heroin Mortality Rate',
			suffix: '%',
			stateMin: -18.18,
			stateMax: 800,
			countyMin: -30.88, 
			countyMax: 575.93
		},
		in_opioid_prescribing_rate: {
			column: 'opioid_prescribing_rate',
			unit: '',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: ' Deaths',
			tooltip: 'Mortality Rate from Prescribing Opioids Overdoses per 100,000 people.',
			name: 'Prescribing Mortality Rate',
			suffix: '%',
			stateMin: 2.94,
			stateMax: 7.46,
			countyMin: 0, 
			countyMax: 60.26
		},
		in_opioid_prescribing_rate_pct_change: {
			column: 'opioid_prescribing_rate_pct_change',
			unit: 'perc',
			min: 0,
			max: 3,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [0, 1],
			label: '% Deaths',
			tooltip: '% Change of Mortality Rate from Prescribing Opioids Overdoses per 100,000 people.',
			name: 'Prescribing Mortality Rate',
			suffix: '%',
			stateMin: -19.42,
			stateMax: -0.57,
			countyMin: -100, 
			countyMax: 320.22
		}
	},			
	count: {
		in_cnt_pcp: {
			layer: 'c2hgis',
			column: 'pcp_total',
			style: 'pcp',
			color: '#ba0c0c',
			county: {
				min: 10,
				max: 500
			}, 
			state: {
				min: '1,000',
				max: '10,000'
			},
			name: 'Physicians',
			suffix: ''
		},
		in_cnt_ip: {
			layer: 'c2hgis',
			column: 'provcount_c',
			style: 'ip',
			color: '#0050cc',
			county: {
				min: 1,
				max: 25
			}, 
			state: {
				min: 25,
				max: 100
			},
			name: 'Internet Providers',
			suffix: ''
		},
		in_cnt_pop: {
			layer: 'c2hgis',
			column: 'pop_2014',
			style: 'pop',
			color: '#05ad28',
			county: {
				min: '10,000',
				max: '1&nbsp;million'
			}, 
			state: {
				min: '1&nbsp;million',
				max: '10&nbsp;million'
			},
			name: 'Population',
			suffix: ''
		},
		in_cnt_tele: {
			layer: 'c2hgis_telehealth',
			column: 'telehealth_beneficiary_total',
			style: 'telehealth',
			color: '#9d5978',
			county: {
				min: '10',
				max: '100'
			}, 
			state: {
				min: '10',
				max: '100'
			},
			name: 'Telehealth',
			suffix: ' beneficiaries'
		}
	}
};


var health_ly = {
	hh_pcppc: {
		column: 'pcp_per_capita',
		style: 'health_sec_pcpacc',
		unit: 'p100000',
		min: '>90',
		max: '<60',
		ranges: '>90,80-90,70-80,60-70,<60',
		label: 'PCP/100,000',
		tooltip: 'Primary Care Physicians per 100,000 people.'
	},
	hh_poorfair: {
		column: 'poor_fair_health_pct',
		style: 'health_sec_poorfair',
		unit: 'perc',
		min: '<10',
		max: '>17.5',
		ranges: '<10,10-12.5,12.5-15,15-17.5,>17.5',
		label: '% Poor/Fair Health',
		tooltip: 'Percentage of adults reporting fair or poor health (age-adjusted).'
	},
	hh_obesity: {
		column: 'adult_obesity_pct',
		style: 'health_sec_obesity',
		unit: 'perc',
		min: '<25',
		max: '>32.5',
		ranges: '<25,25-27.5,27.5-30,30-32.5,>32.5',
		label: '% Obesity',
		tooltip: 'Percentage of adults that report a BMI of 30 or more.'
	},
	hh_prematured: {
		column: 'years_lost_per_100000',
		style: 'health_sec_prematured',
		unit: 'y100000',
		min: '<5,000',
		max: '>8,000',
		ranges: '<5,000,*,*,*,>8,000',
		label: '# Years Lost',
		tooltip: 'Number of years lost due to premature death before age 75 per 100,000 people.'
	},
	hh_preventhosp: {
		column: 'preventable_hospital_stays_per_1000',
		style: 'health_sec_preventhosp',
		unit: 'p1000',
		min: '<50',
		max: '>70',
		ranges: '<50,50-57,57-62,62-70,>70',
		label: '# Hospital Stays',
		tooltip: 'Number of preventable hospital stays per 1,000 people.'
	},
	hh_sick_days: {
		column: 'poor_physical_health_days_within_last_30_days',
		style: 'health_sec_sickdays',
		unit: 'days',
		min: '<3',
		max: '>4',
		ranges: '<3,3-3.3,3.3-3.6,3.6-4,>4',
		label: '# Sick Days',
		tooltip: 'Average number of physically unhealthy days reported in past 30 days (age-adjusted).'
	},
	hh_diabetes_rate: {
		column: 'diabetes_pct',
		style: 'health_sec_diabetes',
		unit: 'perc',
		min: '<8',
		max: '>12',
		ranges: '<8,8-9,9-10.5,10.5-12,>12',
		label: '% Diabetes',
		tooltip: 'Percentage of adults with diabetes.'
	},
	hh_severe_housing: {
		column: 'severe_housing_problems',
		style: 'health_sec_sevhousing',
		unit: 'perc',
		min: '<12.5',
		max: '>20',
		ranges: '<12.5,12.5-15,15-17.5,17.5-20,>20',
		label: '% Severe Housing',
		tooltip: 'Percentage of households with at least 1 of 4 housing problems: overcrowding, high housing costs, or lack of kitchen or plumbing facilities.'
	}
}

var opioid_ly = {
	hh_diabetes_rate: {
		column: 'diabetes_pct',
		style: 'health_sec_diabetes',
		unit: 'perc',
		min: '<8',
		max: '>12',
		ranges: '<8,8-9,9-10.5,10.5-12,>12',
		label: 'Opioid Abuse Rate',
		tooltip: 'Percentage of adults abusing opioids.'
	},
	hh_obesity: {
		column: 'adult_obesity_pct',
		style: 'health_sec_obesity',
		unit: 'perc',
		min: '<25',
		max: '>32.5',
		ranges: '<25,25-27.5,27.5-30,30-32.5,>32.5',
		label: 'Drug Abuse Rate',
		tooltip: 'Percentage of adults abusing drugs.'
	},
	hh_pcppc: {
		column: 'pcp_per_capita',
		style: 'health_sec_pcpacc',
		unit: 'p100000',
		min: '>90',
		max: '<60',
		ranges: '>90,80-90,70-80,60-70,<60',
		label: 'MHP/100,000',
		tooltip: 'Mental Health providers per 100,000 people.'
	},
	hh_poorfair: {
		column: 'poor_fair_health_pct',
		style: 'health_sec_poorfair',
		unit: 'perc',
		min: '<10',
		max: '>17.5',
		ranges: '<10,10-12.5,12.5-15,15-17.5,>17.5',
		label: '% Poor/Fair Mental Health',
		tooltip: 'Percentage of adults reporting fair or poor mental health (age-adjusted).'
	},
	hh_preventhosp: {
		column: 'preventable_hospital_stays_per_1000',
		style: 'health_sec_preventhosp',
		unit: 'p1000',
		min: '<50',
		max: '>70',
		ranges: '<50,50-57,57-62,62-70,>70',
		label: 'Opioid Prescription Rate',
		tooltip: 'Number of opioid prescriptions per 1,000 people.'
	},
	hh_sick_days: {
		column: 'poor_physical_health_days_within_last_30_days',
		style: 'health_sec_sickdays',
		unit: 'days',
		min: '<3',
		max: '>4',
		ranges: '<3,3-3.3,3.3-3.6,3.6-4,>4',
		label: '# Mentally Ill Days',
		tooltip: 'Average number of mentally unhealthy days reported in past 30 days (age-adjusted).'
	},
	hh_prematured: {
		column: 'years_lost_per_100000',
		style: 'health_sec_prematured',
		unit: 'y100000',
		min: '<5,000',
		max: '>8,000',
		ranges: '<5,000,*,*,*,>8,000',
		label: '# Years Lost',
		tooltip: 'Number of years lost due to premature death before age 75 per 100,000 people.'
	},
	hh_severe_housing: {
		column: 'severe_housing_problems',
		style: 'health_sec_sevhousing',
		unit: 'perc',
		min: '<12.5',
		max: '>20',
		ranges: '<12.5,12.5-15,15-17.5,17.5-20,>20',
		label: '% Severe Housing',
		tooltip: 'Percentage of households with at least 1 of 4 housing problems: overcrowding, high housing costs, or lack of kitchen or plumbing facilities.'
	}
}


var broadband_ly = {
	wn_dl: {
		tooltip: 'Percent of population with access to fixed broadband service at 25 mbps or higher advertised download speeds.'
	},	
	wn_ul: {
		tooltip: 'Percent of population with access to fixed broadband service at 3 mbps or higher advertised upload speeds.'
	},
	ws_dl: {
		tooltip: 'Percent of population with access to 25 mbps advertised wireless download speeds.'
	},	
	ws_ul: {
		tooltip: 'Percent of population with access to 3 mbps advertised wireless upload speeds.'
	},	
	in_adoption: {
		tooltip: 'Percent of households with fixed connections over 200 kbps.'
	},	
	fixed_access: {
		tooltip: 'Percent of population with access to fixed broadband service at 25/3 mbps or higher advertised speeds.'
	}
};

var pop_ly = {
	pop_density: {
		column: 'pop_density',
		style: 'pop_density',
		unit: 'pml',
		min: '<25',
		max: '>250',
		ranges: '<25,25-50,50-100,100-250,>250',
		zindex: 90,
		label: 'Population per sq. mile',
		tooltip: 'Population density per square mile.'
	},
	pop_urbanrural: {
		column: 'rural_pct',
		style: 'pop_urbanrural',
		unit: 'perc',
		min: '<10',
		max: '>50',
		ranges: '<10,10-20,20-35,35-50,>50',
		zindex: 90,
		label: '% Rural',
		tooltip: 'Percentage of population living in a rural area.'
	},
	pop_usac_rural_cat:{
		column: 'usac_rural_cat'
	},
	pop_rucc_mnm_class:{
		column: 'rucc_metrononmetro'
	},
	pop_rucc_rural_cat:{
		column: 'rucc_2013'
	},
	pop_nchs_rural_cat:{
		column: 'nchs_rural'
	},
	pop_nchs_rural_def:{
		column: 'nchs_urbanruralcode'
	},
	pop_omb_rural_cat:{
		column: 'omb_rural'
	},
	pop_age: {
		column: 'age_over_65_pct',
		style: 'pop_age',
		unit: 'perc',
		min: '<12',
		max: '>16',
		ranges: '<12,12-13.5,13.5-14.5,14.5-16,>16',
		zindex: 90,
		label: '% Over 65',
		tooltip: 'Percentage of population ages 65 and older.'
	},
	pop_unemploy: {
		column: 'unemployment',
		style: 'pop_unemploy',
		unit: 'perc',
		min: '<5',
		max: '>8',
		ranges: '<5,5-6,6-7,7-8,>8',
		zindex: 90,
		label: '% Unemployed',
		tooltip: 'Percentage of population ages 16 and older unemployed but seeking work.'
	},
	pop_edu: {
		column: 'some_college',
		style: 'pop_edu',
		unit: 'perc',
		min: '<60',
		max: '>70',
		ranges: '<60,60-63,63-66,66-70,>70',
		zindex: 90,
		label: '% Some College',
		tooltip: 'Percentage of adults ages 25-44 with some post-secondary education.'
	}
}
																		
var in_units = {
	perc: {
		name: 'Percent',
		desc: '%'
	},
	p1: {
		name: 'Per Person',
		desc: 'Per Capita'
	},
	p1000: {
		name: 'Per 1,000 People',
		desc: 'Per 1,000 People'
	},
	p100000: {
		name: 'Per 100,000 People',
		desc: 'Per 100,000 People'
	},
	y100000: {
		name: 'Years Lost Per 100,000 People',
		desc: 'Years'
	},
	st: {
		name: 'Speed Tiers',
		desc: 'Speed Tiers'
	}
};
																
var states_in = {
	FL: {
		lat: 28.5953035358968,
		lng: -82.4958094312413,
		zoom: 7
	},	
	MI: {
		lat: 44.3715397944714,
		lng: -85.4376684832842,
		zoom: 7
	}, 
	MS: {
		lat: 32.7509547380987,
		lng: -89.6621633573408,
		zoom: 7
	}, 
	OH: {
		lat: 40.1903624,
		lng: -82.6692525,
		zoom: 7
	},
	VA: {
		lat: 37.5126006451781,
		lng: -78.7878086547533,
		zoom: 7
	}	
};

var bb_speed_tiers = {
	1: {
		range: '1 - 3',
		min: '1',
		max: '3'
	},
	2: {
		range: '3 - 4',
		min: '3',
		max: '4'
	},
	3:{
		range: '4 - 6',
		min: '4',
		max: '6'
	},
	4: {
		range: '6 - 10',
		min: '6',
		max: '10'
	},
	5: {
		range: '10 - 15',
		min: '10',
		max: '15'
	},
	6: {
		range: '15 - 25',
		min: '15',
		max: '25'
	},
	7: {
		range: '25 - 50',
		min: '25',
		max: '50'
	},
	8: {
		range: '50 - 100',
		min: '50',
		max: '100'
	},
	9: {
		range: '100 - 1,000',
		min: '100',
		max: '1,000'
	},
	10: {
		range: '> 1,000',
		min: '> 1,000',
		max: '> 1,000'
	}
};
var bb_adoption_tiers = {
	1: {
		range: '0 - 20'
	},
	2: {
		range: '20 - 40'
	},
	3: {
		range: '40 - 60'
	},
	4: {
		range: '60 - 80'
	},
	5: {
		range: '80 - 100'
	}
}	