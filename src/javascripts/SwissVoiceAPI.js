import angular from 'angular';
import 'angular-ui-notification';

import _ from 'underscore';
import fixtures from './fixtures';

module.exports = 'SwissVoiceAPI';
angular.module('SwissVoiceAPI', [
        'ui-notification'
    ])
    .config(['NotificationProvider', (NotificationProvider) => {
        NotificationProvider.setOptions({
            delay: 4000,
            startTop: 80,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    }])
    .filter('startAt', () => {
        return (input, start) => {
            if (!input || !input.length) { return; }

            start = +start;
            return input.slice(start);
        };
    })
    .provider('sv', () => {
        var _urlAPI = 'api/';
        var _urlBase = '/';

        function mapData(response) {
            return response.data;
        }

        function errorCallback(error) {
            console.dir(error);
            return error;
        }

        return {
            urlAPI(url) {
                return _urlAPI + url;
            },
            setUrlAPI(url) {
                _urlAPI = url;
            },
            urlBase(url) {
                return _urlBase + url;
            },
            setUrlBase(url) {
                _urlBase = url;
            },
            $get($http, Notification) {
                return {
                    initiatives: {
                        all() {
                            return fixtures.initiatives;
                        },
                        get(key) {
                            return _.extend(fixtures.initiatives[key], {
                                articles: fixtures.articles,
                                opinions: fixtures.opinions
                            });
                        }
                    },
                    articles: {
                        all() {
                            return fixtures.articles;
                        },
                        get(key) {
                            return fixtures.articles[key];
                        }
                    },
                    opinions: {
                        all() {
                            return fixtures.opinions;
                        },
                        get(key) {
                            return fixtures.opinions[key];
                        }
                    }
                }
            }
        }
    });
