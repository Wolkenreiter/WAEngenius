/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* jshint esversion: 6 */
 'use strict';

 angular.module('waEngineCalc').component('engineSchemEditor', {
    templateUrl: 'engine-schem-editor/engine-schem-editor.template.html',
    bindings: {
        enginePartData: '<',
        engineSchemData: '<',
        onUpdate: '&',
        onUpdateName: '&'
    },
    
    controller: [ '$scope',
        function($scope) {
            this.update = property => {
                console.log('updated: ' + property );
                this.onUpdate({property: property, engineSchemData: this.engineSchemData });
            };
            
            this.updateEngineSchem = () => {
                console.log('updating Schematic: ' + this.engineSchemData.baseStats.power);
                $scope.$emit('engineSchem:changed',{engineSchemData: this.engineSchemData});
            };
            this.updateEngineSchemName = () => {
                
                $scope.$emit('engineSchemName:changed', {
                    currentValue: this.engineSchemData.name, 
                    lastValue: this.oldName
                });
                this.oldName = angular.copy(this.engineSchemData.name);
                this.updateEngineSchem();
            }
            this.$onChanges = (changesObj) => {
                if(changesObj.engineSchemData) {
                    this.engineSchemData = angular.copy(changesObj.engineSchemData.currentValue);
                    console.log(this.engineSchemData.name.toString());
                }
            }
            this.oldName = angular.copy(this.engineSchemData.name);
        }
    ]
});

