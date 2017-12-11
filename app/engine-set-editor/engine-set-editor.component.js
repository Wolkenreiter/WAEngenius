/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('waEngineCalc').component('engineSetEditor', {
    templateUrl: 'engine-set-editor/engine-set-editor.template.html',
    bindings:   { 
                    setId: '<',
                    engineSetData: '<' ,
                    materialNames: '<',
                    engineList: '<',
                    engineSetBeingEdited: '<',
                    enginePartData: '<',
                    engineSchemData: '='
                    
                },
    controller: 
        [
            '$scope', 
            function($scope) {
                //additional information to format the layout of the material slot inputs
                this.slotDesc = { 
                    Casing: { hasQuality: false, canFocus: true},
                    'Combustion Internals': { hasQuality: true, canFocus: true },
                    'Mechanical Internals': { hasQuality: false, canFocus: true },
                    Propeller: { hasQuality: true, canFocus: true}
                };
                
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
            }
        ]
    }
);
