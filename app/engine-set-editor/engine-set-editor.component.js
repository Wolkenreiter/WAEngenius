/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* jshint esversion: 6 */
 'use strict';


angular.module('waEngineCalc').component('engineSetEditor', {
    templateUrl: 'engine-set-editor/engine-set-editor.template.html',
    bindings:   
        { 
            setId: '<',
            engineSetData: '<' ,
            materialNames: '<',
            materialData: '<',
            engineList: '<',
            engineSetBeingEdited: '<',
            enginePartData: '<',
            engineSchemData: '<',
            onEngineSchemUpdate: '&'
        },

    controller: [
        '$scope', '$filter',
        function($scope, $filter) {
            //additional information to format the layout of the material slot inputs
            this.slotDesc = { 
                Casing: { hasQuality: false, canFocus: true},
                'Combustion Internals': { hasQuality: true, canFocus: true },
                'Mechanical Internals': { hasQuality: false, canFocus: true },
                Propeller: { hasQuality: true, canFocus: true}
            };
            this.testMatClasses = [{materialClass: 'm' }, {materialClass: 'w'}];
            this.focusComp = function(slotName) {
                try {
                    if(this.slotDesc[slotName].canFocus) {
                        console.log('focusing ' + slotName);
                        $scope.$emit('graphFocus:set', {setId: this.setId, compName: slotName});
                    }
                }
                catch(e) {}
            };
            this.updateEngineSet = () => {
                $scope.$emit('engineSet:changed', {engineSetData: this.engineSetData});
            };
            this.removeEngineSet = () => {
                $scope.$emit('engineSet:remove', {setId: this.setId});
            };
            this.createEngineSchem = () => {
                $scope.$emit('engineSchem:create',{setId: this.setId});
            };
            this.editEngineSchem = () => {
                if(this.engineSetBeingEdited === this.engineSetData.setId)
                    $scope.$emit('engineSchem:stopEdit', {setId: this.setId});
                else
                    $scope.$emit('engineSchem:startEdit', {setId: this.setId});
            };
            this.engineSchemUpdate = (property, engineSchemData) => {
                console.log('Engine Schematic updated');
                this.onEngineSchemUpdate({engineId: this.engineSetData.engineId, property: property, engineSchemData: engineSchemData});
            };
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // verify each material slot has a valid material assigned, according to the current materialClass of the respective part
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            this.validateSlotMaterials = function() {
                try {
                    let slots = {
                        Casing: 'case',
                        Propeller: 'prop'
                    };
                    angular.forEach(slots, (partId, slotName)=> {
                        //get target materialClass
                        let enginePartInfo = this.enginePartData[partId].find(part => { return part.name === this.engineSchemData.name[partId];}); 
                        let materialClass = enginePartInfo.materialClass;
                        let subMatList = $filter('arrayByMaterialClass')(this.materialData, materialClass);
                        if(!subMatList.find(matName => { return this.engineSetData.slots[slotName].material === matName;}))
                            this.engineSetData.slots[slotName].material = subMatList[0];
                    } );
                }
                catch(e) {}
            };
            
            $scope.$on('engineSchemName:changed', (event, args) => {
                console.log(args.currentValue);
            });
            this.$onChanges = function(changesObj)  {
                if(changesObj.engineSchemData) 
                    this.validateSlotMaterials();
                if(changesObj.materialData)
                    this.validateSlotMaterials();
                if(changesObj.enginePartData) 
                    this.validateSlotMaterials();
            };
        }
    ]}
);
