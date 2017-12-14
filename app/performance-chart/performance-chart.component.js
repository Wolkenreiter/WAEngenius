/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* jshint esversion: 6 */
 'use strict';

angular.module('waEngineCalc').component('performanceChart', {
    templateUrl: 'performance-chart/performance-chart.template.html',
    bindings: {
        focusedEngineSet: '<',
        focusedSlot: '<',
        engineName: '<',
        performanceData: '<',
        materialNames: '<'
    },
    controller: ['$scope',
        function($scope){
            //console.log('chart init');
            Chart.defaults.global.elements.line.fill = false;
            this.graphMode = 'speed';
            this.graphData = [];
            this.override = [];
            this.setGraphMode = () => {
                console.log('setting graph Mode ' + this.graphMode);
                $scope.$emit('graphMode:set',this.graphMode);
                switch(this.graphMode) {
                    case 'speed': {
                            this.options.scales.yAxes[0].scaleLabel.labelString = 'Speed [kn]';
                            break;
                    }
                    case 'power:set':
                    case 'power:ship': {
                            this.options.scales.yAxes[0].scaleLabel.labelString = 'Power';
                            break;
                    }
                    case 'massEfficiency': {
                            this.options.scales.yAxes[0].scaleLabel.labelString = 'Mass Efficiency';
                    }
                }
            };
            
            this.$onChanges = (changesObj) => {
                //console.log(changesObj.toString());
            /*    if(changesObj.performanceData) {
                    //this.dataNames = changesObj.materialNames.currentValue;
                    this.graphData = [];
                    let indata = changesObj.performanceData.currentValue;
                    for(let mm in indata) {
                        if(this.materialNames[mm] === this.focusedSlot.slotData.material) {
                            this.graphData[mm] = {
                                data: indata[mm],
                                backgroundColor: 'black'
                            };
                        }
                        else
                            this.graphData[mm] = indata[mm];
                    }
                }*/
                /*if(changesObj.focusedSlot && changesObj.focusedSlot.currentValue) {
                    console.log('slot focus: ');
                    try {
                        Chart.defaults.global.animation.duration = 0;
                        let slotData = changesObj.focusedSlot.currentValue.slotData;
                        for(let mm in this.materialNames) {
                            let alpha = 0;
                            if(this.materialNames[mm] === slotData.material) 
                                alpha = 0.2;
                            this.override[mm].backgroundColor = jQuery.Color(this.override[mm].borderColor).alpha(alpha).toHexString(true);
                        }
                        Chart.defaults.global.animation.duration = 500;
                    }
                    catch(e) {
                        console.log(e);
                    }
                }
                else*/ if(changesObj.materialNames && changesObj.materialNames.currentValue) {
                    this.override.borderColor = [];
                    this.override.backgroundColor = [];
                    let colorNames = Object.keys(jQuery.Color.names);
                    for(let cc=0; cc<this.materialNames.length; cc++) {
                        let color = jQuery.Color(colorNames[cc]);
                        this.override[cc] = {};
                        this.override[cc].borderColor = color.toHexString();
                        this.override[cc].backgroundColor = 'transparent';
                        this.override[cc].pointBackgroundColor = color.toHexString();
                        this.override[cc].pointHoverBorderColor = color.toHexString();
                        this.override[cc].pointHoverBackgroundColor = 'transparent';// color.toHexString();
                        this.override[cc].pointHoverRadius = 6;
                    }
                }
            };
            this.labels = [1,2,3,4,5,6,7,8,9,10];
            this.options = {
                scales: {
                    yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'right',
                        scaleLabel: {
                            display: true,
                            labelString: "Speed [kn]",
                            fontFamily: $('body').css('font-family'),
                            fontColor: "black",
                            fontSize: 13
                        }
                    }],
                    xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Quality',
                            fontFamily: $('body').css('font-family'),
                            fontColor: "black",
                            fontSize: 13
                        }
                    }]
                },
                legend: {
                    display : true,
                    position: 'bottom',
                    labels: {
                        fontFamily: $('body').css('font-family'),
                        fontSize: 14,
                        fontColor: '#000000',
                        usePointStyle: true
                    }
                    /*onClick: (event, legenditem) => {
                        console.log('clicked: ' + legenditem);
                    }*/
                },
                layout: {
                    padding: 15
                },
                tooltips: {
                    mode: 'point'
                }
              };
            /*$scope.onClick = function (points, evt) {
                console.log(points, evt);
            };*/
        }
    ]
});

