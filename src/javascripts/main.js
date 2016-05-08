import angular from 'angular';

import 'angular-sanitize';
import 'angular-animate';
import 'angular-ui-router';
import 'angular-ui-notification';
import 'angular-ui-bootstrap';
import 'angular-bootstrap-show-errors';
import 'angular-marked';
import 'angular-timeago';
import 'ui-select';

import _ from 'underscore';

import './SwissVoiceAPI';

module.exports = angular.module('SwissVoice', [
        'ngSanitize',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.showErrors',
        'ui.select',
        'ui-notification',
        'hc.marked',
        'yaru22.angular-timeago',
        'SwissVoiceAPI'
    ])
    .run(($rootScope, $state, $stateParams) => {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.range = (min, max, step) => {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };
    })
    .config(($stateProvider, $urlRouterProvider, svProvider) => {

        svProvider.setUrlAPI('api/');
        svProvider.setUrlBase('/');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                controller: 'IndexController',
                templateUrl:  svProvider.urlBase('views/index.html'),
                resolve: {
                    initiatives(sv) {
                        return sv.initiatives.all();
                    }
                }
            })
            .state('initiative', {
                url: '/initiative/{key}',
                controller: 'InitiativeController',
                templateUrl:  svProvider.urlBase('views/initiative.html'),
                resolve: {
                    initiative($stateParams, sv) {
                        return sv.initiatives.get($stateParams.key);
                    }
                }
            });
    })
    .directive('svSlider', () => {
        return {
            restrict: 'E',
            scope: {
                slider: '=ngModel'
            },
            templateUrl: 'sv-slider',
            link(scope) {
                scope.slider = _.extend(scope.slider, {
                    position: 3,
                    positionMax: 10,
                    choices: 5
                });

                scope.percent = () => {
                    return 100 * scope.position / scope.positionMax;
                };

                scope.range = (min, max, step) => {
                    step = step || 1;
                    var input = [];
                    for (var i = min; i <= max; i += step) {
                        input.push(i);
                    }
                    return input;
                };
            }
        };
    })
    .directive('svArticles', ($compile) => {
        return {
            restrict: 'A',
            scope: {
                articles: '=ngModel'
            },
            link(scope, element) {
                function updateView(edit) {
                    var html = '';
                    _.each(scope.articles, a => {
                        html += '<circle ng-repeat="a in articles" ng-click="openArticle(a)" uib-popover-template="\'popover-article\'" popover-append-to-body="true" popover-trigger="mouseenter" class="item" cx="{{a.x}}" cy="{{a.y}}" r="{{a.r}}" style="{fill: rgba(255, 255, 255, {{a.o}})}"> </circle>';
                    });
                    element.html(html);
                    $compile(element.contents())(scope);
                }

                scope.$watch('articles', edit => {
                    updateView(edit);
                });
            }
        };
    })
    .controller('IndexController', ($scope, sv, initiatives) => {
        $scope.initiatives = initiatives;
    })
    .controller('InitiativeController', ($scope, $window, $uibModal, sv, initiative) => {

        $scope.initiative = initiative;

        /*
         * Graphs
         */

        $scope.graph = {
            w: 600,
            h: 200
        };

        $scope.$watch('window.innerWidth', () => {
            $scope.graph.w = $window.innerWidth;
            reloadGraphs();
        });

        $scope.$watch('window.innerHeight', () => {
            $scope.graph.h = $window.innerHeight - 65;
            reloadGraphs();
        });

        function reloadGraphs() {
            reloadOpinions();
            reloadArticles();
        }

        function popoverPosition(x, y) {
            var pos = '';
            if (x < 20) {
                pos = 'right'
            } else if (x > 80) {
                pos = 'left'
            }

            if (y < 20) {
                if (pos) {
                    pos += '-top';
                } else {
                    pos = 'bottom';
                }
            } else if (y > 80) {
                if (pos) {
                    pos += '-bottom';
                } else {
                    pos = 'top';
                }
            }
            return pos;
        }

        function popoverObject(x, y, r, o) {
            return {
                pos: popoverPosition(x, y),
                x: 10 + x * ($scope.graph.w-135) / 100,
                y: 10 + y * ($scope.graph.h-120) / 100,
                r: 10 + Math.min(r, 40),
                o: 0.4 + Math.min(o / 10, 4) / 4
            }
        }

        /*
         * Slider
         */

        $scope.slider = {
            percent: 50,
            choices: 5
        };

        /*
         * Articles
         */

        $scope.filters = {
            type: 'media',
            sliderA: {},
            sliderB: {},
            sliderC: {},
            sliderD: {}
        };

        /*
         * Articles
         */
        $scope.articles = [];
        function reloadArticles() {
            $scope.articles = _.map(initiative.articles, a => {
                return _.extend(a, popoverObject(a.procons, 100-a.date, a.comments, a.readingTime));
            });
        }

        $scope.openArticle = (article) => {
            console.log(article);
            $uibModal.open({
                size: 'lg',
                templateUrl: 'modal-article',
                controller: 'ArticleController',
                resolve: {
                    height: $scope.graph.h,
                    article: article
                }
            });
        };

        /*
         * Opinions
         */

        $scope.opinions = [];
        function reloadOpinions() {
            $scope.opinions = _.map(initiative.opinions, o => {
                return _.extend(o, popoverObject(o.procons, 100-o.date, o.comments, o.upvotes));
            });
        }

    })
    .controller('ArticleController', ($scope, $sce, $timeout, sv, article, height) => {
        $scope.height = height;
        $scope.article = article;
        if (article.url) {
            $timeout(() => {
                $scope.url = $sce.trustAsResourceUrl(article.url);
            }, 500);
        }
    });
