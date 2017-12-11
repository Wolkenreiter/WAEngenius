'use strict';

function EngineSchem() {
    this.baseStats = { power: 0 };
    this.components =  { 
        Casing: { matCount: 0 },
        'Combustion Internals': {matCount: 0},
        'Mechanical Internals': {matCount: 0},
        Propeller: { matCount: 0 }
    };
    this.name = { case: '', head: '', prop: '', number: 1 };
    this.name.toString = () => {
        return (this.name.case + ' ' + this.name.head + ' ' + this.name.prop + this.name.number);
    };
}

EngineSchem.Default = function() {
    var eng = new EngineSchem();
    eng.baseStats.power = 50;
    eng.name.case = 'Ironforge';
    eng.name.head = 'Elite';
    eng.name.prop = 'H';
    eng.name.number = 1;
    eng.components.Casing.matCount = 200;
    eng.components['Combustion Internals'].matCount = 220;
    eng.components['Mechanical Internals'].matCount = 150;
    eng.components.Propeller.matCount = 100;
    return eng;
};

// Declare app level module which depends on views, and components
angular.module('waEngineCalc', ['chart.js']).component('app', {
    templateUrl : 'app/app.template.html',
    controller: [ '$scope', '$window',
        function($scope, $window) {
            this.materialData = {};
            this.engineSetBeingEdited = '';
            var app = this;
            
            //entry in the list of currently stored ships
            this.ShipDesc = function () {
                this.id = shortid.gen();
                this.name = 'unnamed ship';
            };
            //an engine set consists of the id of an EngineSchem, the count of that engine 
            //and the actual material configuration for their components
            this.EngineSet = function () {
                this.setId = shortid.gen();
                this.engineId = app.engineList[0].id;
                this.count = 2;
                this.slots = { 
                    Casing: { material: 'Iron' , quality: 5 },
                    'Combustion Internals': {material: 'Iron', quality: 5 },
                    'Mechanical Internals': {material: 'Iron', quality: 5 },
                    Propeller: { material: 'Iron', quality: 5 }
                };
                this.getPower = () => {
                    try {
                        let schem = app.engineList.find((val) => { return val.id === this.engineId; }).schem;
                        return this.count * schem.baseStats.power 
                            * (1 + app.materialData[this.slots['Combustion Internals'].material].comb[this.slots['Combustion Internals'].quality - 1]
                            + app.materialData[this.slots.Propeller.material].prop[this.slots.Propeller.quality - 1]);
                    }
                    catch(e) {
                        //console.log(e);
                    }
                };
                this.getMass = ()=> {
                    try {
                        let schem = app.engineList.find((val) => { return val.id === this.engineId; }).schem;
                        let compKeys = Object.keys(this.slots);
                        let mass = 0;
                        for(let ss in compKeys) 
                            mass += app.materialData[this.slots[compKeys[ss]].material].unitMass * schem.components[compKeys[ss]].matCount;
                        return this.count * mass;
                    }
                    catch(e) {
                        return 0;
                    }
                };
            };
            //the actual ship configuration
            this.ShipConfig = function () {
                this.engines = [];
                this.baseMass = '1000';
                this.addPower = '0';
                this.getPower = () => {
                    if(this.addPower.match('^[\\d\\(\\)\\+\\-\\*\\/\\.\\s]+$')) {
                        try {
                            var power = eval(this.addPower);
                        }
                        catch(e) {
                            var power = 0;
                        }
                    }
                    else
                        var power = 0;
                    for(let ee in this.engines)  
                        power += this.engines[ee].getPower();
                    return power;
                };
                this.getMass = () => {
                    if(this.baseMass.match('^[\\d\\(\\)\\+\\-\\*\\/\\.\\s]+$')) {
                        try {
                            var mass = eval(this.baseMass);
                        }
                        catch(e) {
                            var mass = 0;
                        }
                    }
                    else
                        var mass = 0;
                    for(let ee in this.engines)
                        mass+= this.engines[ee].getMass();
                    return mass;
                };
                this.getSpeed = () => {
                    return 50* Math.sqrt(2 * this.getPower()/this.getMass());
                };
                this.clone = () => {
                    var copy = _.merge(new app.ShipConfig(),JSON.parse(JSON.stringify(this)));
                    
                    /*copy.engines = [];
                    for(let ee in this.engines) {
                        let set = _.merge(new app.EngineSet(), this.engines[ee]);
                        //set.slots = angular.copy(this.engines[ee].slots);
                        copy.engines[ee] = set;
                        copy.engines[ee].setId = this.engines[ee].setId;
                    };
                    copy.getPower = this.getPower.bind(copy);
                    copy.getSpeed = this.getSpeed.bind(copy);
                    copy.getMass = this.getMass.bind(copy); */
                    return copy;
                };
            };
            
            this.ShipConfig.Default = function () {
                var c = new app.ShipConfig();
                c.engines = [new app.EngineSet()];
                return c;
            };
            //save the current ship configuration to local storage
            this.saveShipConfig = () => {
                console.log('saving ship config');
                $window.localStorage.setItem('ship:' + this.shipList[0].id, JSON.stringify(this.currentShip));
            };
            this.updateShipConfig = () => {
                this.recalcChartData();
                this.saveShipConfig();
            };
            this.saveEngineList = () => {
                $window.localStorage.setItem('engines', JSON.stringify(this.engineList));
            };
            //add a new engine set to the current ship configuration
            this.addEngineSet = function () {
                app.currentShip.engines.push(new app.EngineSet());
                this.recalcChartData();
                this.saveShipConfig();
            };
            this.getEngineSchemById = (schemId) => {
                try {
                    var schem = this.engineList.find((val) => {return val.id === schemId; }).schem;
                    return schem;
                }
                catch(e) {
                }
            };
            
            this.recalcChartData = () => {
                var oldMat, oldQ;
                try {
                    var setId = this.focusedEngineSet;
                    var comp = this.focusedEngineComp;
                    var tempConfig = this.currentShip;
                    var set = tempConfig.engines.find((val)=> { return val.setId === setId; } );
                    
                    oldMat = set.slots[this.focusedEngineComp].material;
                    oldQ = set.slots[this.focusedEngineComp].quality;
                    this.chartData = [];
                    for(let mm in this.materialNames) {
                        set.slots[comp].material = this.materialNames[mm];
                        this.chartData[mm] = [];
                        for(let qq=1; qq<=10; qq++) {
                            set.slots[comp].quality = qq;
                            switch(this.graphMode) {
                                case 'speed': {
                                    this.chartData[mm].push(tempConfig.getSpeed());
                                    break;
                                }
                                case 'power:set': {
                                    this.chartData[mm].push(set.getPower());
                                    break;
                                }
                                case 'power:ship': {
                                    this.chartData[mm].push(this.currentShip.getPower());
                                    break;
                                }
                                case 'massEfficiency': {
                                    this.chartData[mm].push(this.currentShip.getPower() / this.currentShip.getMass());
                                }
                            }
                        }
                    }
                    set.slots[this.focusedEngineComp].material = oldMat;
                    set.slots[this.focusedEngineComp].quality = oldQ;
                    return this.chartData;
                }
                catch(e) {
                }
            };
            this.getChartData = () => {
                return this.chartData;
            };
            
            angular.element( () =>  {  
                var graph = $('#graph-floater');
                var top = graph.offset().top - parseFloat(graph.css('marginTop'));
                angular.element($window).bind('resize', ()=> {        
                    var graph = $('#graph-floater');
                    graph.width(0.45 * $(window).width());
                });
                angular.element($window).bind('scroll', () => {
                    try {
                        var ypos = angular.element($window).scrollTop();
                        if (ypos >= top) 
                            graph.addClass('fixed');
                        else 
                            graph.removeClass('fixed');
                        graph.width(0.45 * $(window).width());
                    }
                    catch(e) {}

                });
            });

            $scope.$on('engineSet:remove', (event, args) => {
                try {
                    this.currentShip.engines.splice(this.currentShip.engines.findIndex((eSet) => { return eSet.setId === args.setId; } ), 1);
                    this.saveShipConfig();
                    this.recalcChartData();
                }
                catch(e) {
                }
            });
            $scope.$on('engineSchem:create', (event, args) => {
                let engine = EngineSchem.Default();
                var engId = shortid.gen();
                //build a default list of engines
                this.engineList.push( { id: engId, schem: engine});
                this.saveEngineList();
                this.currentShip.engines.find((val) => { return val.setId === args.setId; }).engineId = engId;
                this.engineSetBeingEdited = args.setId;
            });
            $scope.$on('engineSchem:changed', (event, args) => {
                this.saveEngineList();
                this.recalcChartData();
            });
            $scope.$on('engineSchem:startEdit', (event, args) => {
                this.engineSetBeingEdited = args.setId;
            });
            $scope.$on('engineSchem:stopEdit', (event, args) => {
                this.engineSetBeingEdited = '';
            });
            $scope.$on('engineSet:changed', (event, args) => {
                this.saveShipConfig();
                this.recalcChartData();
                this.focusedEngineName = this.getEngineSchemById(args.engineSetData.engineId).name.toString();
                this.focusedSlot = { 
                        name:  this.focusedSlot.name,
                        slotData : args.engineSetData.slots[this.focusedSlot.name] };  
                //this.focusedEngineName = this.getEngineSchemById(this.currentShip.engines.find((ee)=>{return ee.setId === args.setId;}).engineId).name.toString();
            });
            $scope.$on('graphFocus:set', (event, args) => {
               console.log('graph focus: ' + args.setId);
               this.focusedEngineSet = args.setId;
               this.focusedEngineComp = args.compName;
               this.focusedSlot = { 
                   name : args.compName,
                   slotData: this.currentShip.engines.find((val)=> { return val.setId === args.setId;} ).slots[args.compName]
               };
               this.focusedEngineName = this.getEngineSchemById(this.currentShip.engines.find((ee)=>{return ee.setId === args.setId;}).engineId).name.toString();
               this.recalcChartData();
            });
            $scope.$on('graphMode:set', (event, args)=> {
               this.graphMode = args; 
               this.recalcChartData();
            });
            this.$onInit = () => {
                //fetch engine data from local storage
                this.engineList = [];
                this.chartData = [];
                let storageData = $window.localStorage.getItem('engines');
                if(!storageData) {
                    let engine = EngineSchem.Default();
                    var engId = shortid.gen();
                    //build a default list of engines
                    this.engineList = [ { id: engId, schem: engine}];
                    $window.localStorage.setItem('engines', JSON.stringify(this.engineList));
                }
                else {
                    let engineDataList = JSON.parse(storageData);
                    for(let ee in engineDataList) {
                        this.engineList.push({id: engineDataList[ee].id, schem: _.merge (new EngineSchem(), engineDataList[ee].schem)});
                    }
                }
                storageData = $window.localStorage.getItem('ships');
                if(!storageData) {
                    let shipdesc = new this.ShipDesc();
                    this.shipList = [shipdesc];
                    this.currentShip = this.ShipConfig.Default();
                    $window.localStorage.setItem('ships', JSON.stringify(this.shipList));
                    $window.localStorage.setItem('ship:'+ shipdesc.id, JSON.stringify(this.currentShip));
                }
                else {
                    let shipDataList = JSON.parse(storageData);
                    this.shipList = shipDataList;

                    let storageShipData = $window.localStorage.getItem('ship:' + this.shipList[0].id);
                    if(!storageShipData) {
                        this.currentShip = app.ShipConfig.Default();
                        $window.localStorage.setItem('ship:'+ this.shipList[0].id, JSON.stringify(this.currentShip));
                    }
                    else {
                        this.currentShip =  _.merge(new this.ShipConfig(), JSON.parse(storageShipData));
                        for(let ee in this.currentShip.engines) {
                            this.currentShip.engines[ee] = _.merge(new this.EngineSet(), this.currentShip.engines[ee]);
                        }
                    }
                }
                //set initial chart focus
                this.focusedEngineSet = this.currentShip.engines[0].setId;
                this.focusedEngineName = this.getEngineSchemById(this.currentShip.engines[0].engineId).name.toString();
                this.focusedEngineComp = 'Combustion Internals';
                this.focusedSlot = { 
                   name : 'Combustion Internals',
                   slotData: this.currentShip.engines[0].slots['Combustion Internals']
               };

                this.graphMode = 'speed';
                sheetrock({
                    url: 'https://docs.google.com/spreadsheets/d/1RBskFnl2LbcOv9Dr_eLbeUkFY8h8ZMVhwmT5opuGnNg/edit#gid=153389871',
                    query: 'select B,C,D,E,F,G',
                    callback: (error, options, response) => {
                        if(!error) {
                            $scope.$apply( () => {
                                this.enginePartData = { 
                                    case: [],
                                    head: [],
                                    prop: []
                                };
                                for(let rr in response.rows) {
                                    let idx = 0;
                                    var partNames = Object.keys(this.enginePartData);
                                    for(let pp in partNames) {
                                        let partName = response.rows[rr].cellsArray[pp*2];
                                        if(partName) {
                                            this.enginePartData[partNames[pp]].push({ 
                                                name: partName,
                                                materialClass: response.rows[rr].cellsArray[pp*2+1]
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                });

                //query material power boost table from Google spreadsheet
                sheetrock({
                    url: 'https://docs.google.com/spreadsheets/d/1RBskFnl2LbcOv9Dr_eLbeUkFY8h8ZMVhwmT5opuGnNg/edit#gid=0',
                    query: 'select B,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X offset 1',
                    callback: (error, options, response) => {
                        if(!error) {
                            $scope.$apply( ()=> {
                                for(var ii = 0; ii<response.rows.length; ii++){
                                    var matName = response.rows[ii].cellsArray[0];
                                    this.materialData[matName] = { 
                                        unitMass: Number(response.rows[ii].cellsArray[1]),
                                        comb: response.rows[ii].cellsArray.slice(2,12).map(Number),
                                        prop: response.rows[ii].cellsArray.slice(12).map(Number)
                                    };
                                }
                                this.materialNames = Object.keys(this.materialData);
                                this.recalcChartData();
                            });
                        }
                        //else
                            //alert(error);
                    }
                });
            }
        }
    ]
});

/*angular.module('waEngineCalc', [
  'ngRoute',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);*/
