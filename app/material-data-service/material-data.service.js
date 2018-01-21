//jshint esversion: 6
'use strict';

angular.module('waEngineCalc').service('materialData', [
    '$q',
    function($q) {
        //query material power boost table from Google spreadsheet
        this.initData = function () {
            this.data = [];
            return $q((resolve, reject) => {
                this.statBoosts = {};
                sheetrock({
                    url: 'https://docs.google.com/spreadsheets/d/1RBskFnl2LbcOv9Dr_eLbeUkFY8h8ZMVhwmT5opuGnNg/edit#gid=0',
                    query: 'select B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X offset 1',
                    callback: (error, options, response) => {
                        if(!error) {
                            this.statBoosts.power = {};
                            for(var ii = 0; ii<response.rows.length; ii++){
                                var matName = response.rows[ii].cellsArray[0];
                                if(!this.data[matName])
                                    this.data[matName] = {};
                                this.data[matName].standardWpU =  Number(response.rows[ii].cellsArray[2]);
                                this.data[matName].materialClass = response.rows[ii].cellsArray[1];
                                if(!this.data[matName].statBoosts)
                                    this.data[matName].statBoosts = {};
                                this.data[matName].statBoosts.power = { 
                                    comb: response.rows[ii].cellsArray.slice(3,13).map(Number),
                                    prop: response.rows[ii].cellsArray.slice(13).map(Number)
                                };
                        }
                            this.materialNames = Object.keys(this.data);
                            resolve();
                        }
                        else
                            reject(error);
                    }
                });
            });
        };
    }
]
);