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
        onUpdate: '&'
    },
    
    controller: [ 
        function() {
            //propagate changes on engine schematic to parent component
            this.update = function(property) {
                //console.log('updated: ' + property );
                this.onUpdate({property: property, engineSchemData: this.engineSchemData });
            };
            //create a copy of the bound data on change
            this.$onChanges = function(changesObj) {
                if(changesObj.engineSchemData) {
                    this.engineSchemData = angular.copy(changesObj.engineSchemData.currentValue);
                    //console.log(this.engineSchemData.name.toString());
                }
            };
        }
    ]
});

