var app = angular.module('app', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider.state({
		name: 'main',
		url: '/',
		templateUrl: './temp/main.html',
		controller: 'main'
	}).state({
		name: 'signup',
		url: '/signup',
		templateUrl: './temp/signup.html',
		controller: 'signup'
	}).state({
		name: 'signin',
		url: '/signin',
		templateUrl: './temp/signin.html',
		controller: 'signin'
	}).state({
		name: 'publish',
		url: '/publish',
		templateUrl: './temp/publish.html',
		controller: 'publish'
	})
})