/**
 * Created by airswoop1 on 6/10/14.
 */
// app.js
// create our angular app and inject ngAnimate and ui-router
// =============================================================================
angular.module('formApp', ['ngAnimate', 'ui.router'])

    .directive('selectRace', function(){
        return {
            restrict:'E',
            templateUrl:'select-race.html',
            controller: function(){
                this.race = "Caucasian";

                this.getRace = function(){
                    return this.race;
                }
            },
            controllerAs : 'selected_race'
        }
    })

    /*.directive('ssn', function()
     {
     return {
     restrict: 'A',
     replace: true,
     require:'ngModel',
     scope: {
     ssn: '=ssn'
     },
     templateUrl: 'ssn-container.html'
     }
     })*/

// configuring our routes
// =============================================================================
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            // route to show our basic form (/form)
            .state('form', {
                url: '/form',
                templateUrl: 'form.html',
                controller: 'formController'
            })

            .state('form.intro', {
                url: '/intro',
                templateUrl: 'form-intro.html'
            })


            .state('form.recert', {
                url: '/recert',
                templateUrl: 'form-recert.html'
            })

            .state('form.basic-info', {
                url: '/basic-info',
                templateUrl: 'form-basic-info.html'
            })


            // url will be /form/address
            .state('form.address', {
                url: '/address',
                templateUrl: 'form-address.html'
            })

            .state('form.mailing-address',{
                url: '/mailing-address',
                templateUrl: 'form-mailing-address.html'

            })

            .state('form.personal-info',{
                url: '/personal-info',
                templateUrl: 'form-personal-info.html'

            })

            .state('form.living-with',{
                url: '/living-with',
                templateUrl: 'form-living-with.html'

            })

            .state('form.detail-res-citizens',{
                url: '/detail-res-citizens',
                templateUrl: 'detail-res-citizens2.html'
            })

            .state('form.detail-harbor-felon',{
                url: '/detail-harbor-felon',
                templateUrl: 'detail-harbor-felon.html'
            })

            .state('form.detail-group-living-with',{
                url: '/detail-group-living-with',
                templateUrl: 'detail-group-living-with.html'
            })

            .state('form.income',{
                url:'/income',
                templateUrl:'form-income.html'
            })


        // catch all route
        // send users to the form page
        $urlRouterProvider.otherwise('/form/basic-info');
    })

// our controller for the form
// =============================================================================
    .controller('formController', function($scope, $state, $http) {

        // we will store all of our form data in this object
        $scope.formData = {
            lw_disabled:"false",
            lw_vet:"false",
            other_residents: [],
            res_non_citizens : [],
            income_sources : []
        };

        //data objects for holding input temporarily
        $scope.new_resident = {};
        $scope.new_income = {
            frequency: "Bi-weekly"
        };


        //data flags for optional fields
        $scope.alt_phone = false;
        $scope.resident_non_citizen = false;


        $scope.addIncome = function(next){
            if(this.new_income.hasOwnProperty('amount')){
                this.formData.income_sources.push(this.new_income);
                this.new_income = {
                    frequency: "Bi-weekly"
                };
            }

            if(next){
                $state.go('form.personal-info');
            }
            return true;
        }

        $scope.addResident = function(){
            this.formData.other_residents.push(this.new_resident); //add user to other_residents
            this.new_resident = {}; //clear form data

        }

        $scope.nonCitizens = function(){
            this.resident_non_citizen = true;
        }

        // function to process the form
        $scope.processBasicForm = function() {
            alert('processing form');
            console.log($http.defaults.headers.post);
            $http.post('http://localhost:8080/create_base_pdf', JSON.stringify($scope.formData))
                .success(function(data, status, headers, config) {

                    alert("successfully received success callback");
                    console.log(status);
                    console.log(data);
                    console.log(headers);
                    console.log(config);

                    $state.go('form.personal-info');
                })
                .error(function(data, status, headers, config) {

                    alert("successfully received error callback");
                    console.log(status);
                    console.log(data);
                    console.log(headers);
                    console.log(config);

                });
        };

    })
