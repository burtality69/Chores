///<reference path="../../all.d.ts"/>

module Chores.Directives{
	
	interface IFileUploadScope extends ng.IScope {
		fileUploadCtrl: fileUploadCtrl
	}
	
	export function fileUpload() : ng.IDirective {
		return {
			restrict: 'EA',
			scope: {},
			controller: fileUploadCtrl,
			bindToController: true,
			require: '^ngModel',
			controllerAs: 'FileUploadCtrl',
			link: (scope: IFileUploadScope ,el: ng.IAugmentedJQuery, attr: ng.IAttributes,model: ng.INgModelController) =>{
				
				el.on('change',ev=>{
					ev.preventDefault();
					var img: File = (<HTMLInputElement>el[0]).files[0];
					scope.fileUploadCtrl.upload(img).then(result => {
						model.$setViewValue(result);
					})
				})
			}
		}
	}
	class fileUploadCtrl {
		
		static $inject = ['$scope','$http','$q'];
		
		constructor (public $scope: IFileUploadScope,
					 public $http: ng.IHttpService,
					 public $q: ng.IQService) {
						 $scope.fileUploadCtrl = this;
		}
		
		upload(f: File): ng.IPromise<any> {
			var p = this.$q.defer();
			
			var reader = new FileReader();
			reader.onload = (e: Event)=>{ p.resolve((<FileReader>e.target).result);}
			reader.readAsDataURL(f);
			return p.promise;
		}
	}
}