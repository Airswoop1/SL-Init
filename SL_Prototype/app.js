/**
 * Created by airswoop1 on 6/10/14.
 */
// app.js
// create our angular app and inject ngAnimate and ui-router
// =============================================================================
angular.module('formApp', ['angularFileUpload', 'ngAnimate', 'ui.router' ])

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

    .directive('snapInformation', function(){
        return {
            restrict:'E',
            templateUrl:'process-info.html'
        }
    })

    .directive('requiredDocuments', function(){

        return {
            restrict:'E',
            templateUrl:'required-documents.html'
        }
    })

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

            .state('form.name', {
                url: '/name',
                templateUrl:'form-name.html'
            })

            .state('form.recert', {
                url: '/recert',
                templateUrl: 'form-recert.html'
            })

            .state('form.basic-info', {
                url: '/basic-info',
                templateUrl: 'form-basic-info.html'
            })

            .state('form.telephone', {
                url: '/telephone',
                templateUrl: 'form-telephone.html'
            })


            // url will be /form/address
            .state('form.address', {
                url: '/address',
                templateUrl: 'form-address.html'
            })

            .state('form.basic-confirmation', {
                url: '/basic-confirmation',
                templateUrl: 'form-basic-confirmation.html'
            })

            .state('form.basic-app-submitted', {
                url: '/app-submitted',
                templateUrl: 'basic-app-submitted.html'
            })


            .state('form.interview-information', {
                url:'/interview-information',
                templateUrl:'form-interview-information.html'
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

            .state('form.upload',{
                url:'/upload',
                templateUrl:'upload-test.html'
            })


        // catch all route
        // send users to the form page
        $urlRouterProvider.otherwise('/form/intro');
    })

// our controller for the form
// =============================================================================
    .controller('formController', function($scope, $state, $http, $rootScope, $upload) {

        // we will store all of our form data in this object
        $scope.formData = {
            lw_disabled:"false",
            lw_vet:"false",
            name: {},
            other_residents: [],
            res_non_citizens : [],
            income_sources : []
        };

        //data objects for holding input temporarily
        $scope.new_resident = {};
        $scope.new_income = {
            frequency: "Bi-weekly"
        };
        $scope.init_name = "";
        $scope.progress = 0;
        $scope.date = new Date();
        $scope.date_of_interview = new Date();
        $scope.date_of_interview.setDate($scope.date.getDate() + 10);


        //data flags for optional fields
        $scope.alt_phone = false;
        $scope.resident_non_citizen = false;
        $scope.basic_confirmation_agree = false;
        $scope.has_phone = false;
        $scope.completed_first_name = false;




        if($state.current.name == 'form.intro'){
            $scope.show_progress = false;
        }
        else{
            $scope.show_progress = true;
        }


        $scope.initNameStart = function(){
            this.formData.name.full_name = this.init_name;

            var split_name = this.init_name.split(' ');

            this.formData.name.first_name = split_name[0];

            if(split_name.length == 1) {
                $scope.completed_first_name = true;
                $state.go('form.name');
            }
            else if(split_name.length == 2) {
                this.formData.name.last_name = split_name[1];
                $state.go('form.address');
            }
            else if(split_name.length >= 3) {
                this.formData.name.middle_name = split_name[1];
                this.formData.name.last_name = split_name[2];
                $state.go('form.address');
            }
            else {
                $state.go('form.name');
            }


        }

        $scope.submitBasicApp = function() {
            $scope.basic_confirmation_agree = true;
            this.processBasicForm();
            //process form here
            $state.go('form.basic-app-submitted');
        }

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

        $scope.addResident = function() {
            this.formData.other_residents.push(this.new_resident); //add user to other_residents
            this.new_resident = {}; //clear form data

        }

        $scope.nonCitizens = function() {
            this.resident_non_citizen = true;
        }


        $scope.completedBasicInfo = function() {
            if(this.formData.name.first_name && this.formData.name.last_name) {
                $state.go('form.address');
            }
            else {
             this.throwErrors('form.basic-info')
            }
        }


        $scope.throwErrors = function(page) {
            alert('you must fill out all required fields!');
        }

        // function to process the form
        $scope.processBasicForm = function() {
            console.log($http.defaults.headers.post);
            $http.post('http://ec2-54-213-211-187.us-west-2.compute.amazonaws.com/create_base_pdf', JSON.stringify($scope.formData))
                .success(function(data, status, headers, config) {

                    console.log(status);
                    console.log(data);
                    console.log(headers);
                    console.log(config);

                })
                .error(function(data, status, headers, config) {

                    console.log(status);
                    console.log(data);
                    console.log(headers);
                    console.log(config);

                });


        };


        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'http://localhost:1337/upload_docs',

                    data: {myObj: $scope.myModelObj, "the_data":"oohhh zee data"},
                    file: file

                    /* set the file formData name ('Content-Desposition'). Default is 'file' */
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                    });

            }

        };

        $rootScope.$on('$stateChangeStart', function(event, toState){
            if(toState.name == 'form.intro' || toState.name == 'form.interview-information') {
                $scope.show_progress = false
            }
            else {
                if($scope.show_progress == false){
                    $scope.show_progress = true;
                }
            }

            if($scope.progress < 100){
                $scope.progress += 20;
            }

        })

    })

    .filter('tel', function () {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return tel;
            }

            if (country == 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);

            return (country + " (" + city + ") " + number).trim();
        };
    });
