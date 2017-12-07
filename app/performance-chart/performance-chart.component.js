/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('waEngineCalc').component('performanceChart', {
    templateUrl: 'performance-chart/performance-chart.template.html',
    bindings: {
        focusedEngineSet: '<',
        focusedComponent: '<',
        engineName: '<',
        performanceData: '<',
        materialNames: '<'
    },
    controller: ['$scope',
        function($scope){
            console.log('chart init');
            //this.dataSetNames = ['Titanium','Iron', 'Steel', 'Nickel', 'Tungsten'];
            
            Chart.defaults.global.elements.line.fill = false;
            this.graphMode = 'speed';
            this.setGraphMode = () => {
                console.log('setting graph Mode ' + this.graphMode);
                $scope.$emit('graphMode:set',this.graphMode);
                switch(this.graphMode) {
                    case 'speed': {
                            this.options.scales.yAxes[0].scaleLabel.labelString = 'Speed [kn]';
                            //this.options.scales
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
                /*if(changesObj.materialNames) {
                    this.dataNames = changesObj.materialNames.currentValue;
                    //console.log('materialNames changed');
                }*/
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
                            fontSize: 16
                        }
                    }],
                    xAxes: [
                    {
                        /*id: 'x-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'bottom',*/
                        scaleLabel: {
                            display: true,
                            labelString: 'Quality',
                            fontFamily: $('body').css('font-family'),
                            fontColor: "black",
                            fontSize: 16
                        }
                    
                    }]
                },
                legend: {
                    display : true,
                    position: 'bottom',
                    labels: {
                        fontFamily: $('body').css('font-family'),
                        fontSize: 16,
                        fontColor: '#000000'
                    }
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
            //$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            
        }
    ]
});

