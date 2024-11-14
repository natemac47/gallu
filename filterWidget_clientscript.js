function($scope, $location, $timeout, $window, $document, $rootScope, spUtil, spAriaUtil, i18n) {
    var c = this;

    spUtil.getPreference('glide.ui.accessibility', function(value) {
        $scope.tabindex = (value == "true") ? 0 : -1;
    });

    $scope.isActive = sessionStorage.getItem('isActive') === 'true';

    $scope.setActiveFilter = function(isActive) {
        $scope.isActive = isActive;
        sessionStorage.setItem('isActive', isActive);
        
        const savedCategory = JSON.parse(sessionStorage.getItem('savedCategory'));
        if (savedCategory) {
            $scope.selectedCategory = savedCategory;
        }
        
        $scope.updateCategoryFilter();
    };

    $scope.caseFilterSelected = function(category) {
        $scope.selectedCategory = category;
        sessionStorage.setItem('savedCategory', JSON.stringify(category));
        $scope.updateCategoryFilter();
    };

    $scope.updateCategoryFilter = function() {
        var activeValue = $scope.isActive ? 'true' : 'false';
        var baseFilter = sessionStorage.getItem('savedFilter') || 'caller_idDYNAMIC90d1921e5f510100a9ad2572f2b477fe';
        var activeFilterParam = '^active=' + activeValue;
        var filter = $scope.selectedCategory ? ($scope.selectedCategory.query || baseFilter) : baseFilter;

        filter = filter.replace(/(\^)?active=(true|false)/g, '');
        filter += activeFilterParam;

        var encodedFilter = encodeURIComponent(filter);
        var savedTable = $scope.selectedCategory ? $scope.selectedCategory.table : (sessionStorage.getItem('savedTable') || 'incident');
        var savedView = $scope.selectedCategory ? $scope.selectedCategory.view : (sessionStorage.getItem('savedView') || 'ess');

        var url = "?id=gu_my_lists_1" +
                  "&table=" + savedTable +
                  "&view=" + savedView +
                  "&target_page_id=" + ($scope.selectedCategory ? $scope.selectedCategory.targetPageId : 'standard_ticket') +
                  "&filter=" + encodedFilter +
                  "&sel=" + ($scope.selectedCategory ? $scope.selectedCategory.selectedFilter : 'my_incs');

        $location.url(url);

        if ($scope.selectedCategory) {
            spAriaUtil.sendLiveMessage(i18n.format(c.data.pageContentLoadedMsg, {'0': $scope.selectedCategory.myListFilter}), 'status');
        }
    };

    $scope.storeInitialFilter = function() {
        const urlParams = new URLSearchParams($window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) {
            sessionStorage.setItem('savedFilter', filterParam);
        }
    };

    $scope.storeInitialFilter();

    $timeout(function() {
        var result = $(".v5001b062d7101200b0b044580e6103eb > .panel");
        if (!angular.element(result).scope().data.useInstanceTitle) {
            for (var i = 0; i < $scope.data.list.length; i++) {
                if ($scope.data.list[i].selectedFilter == $scope.data.selectedFilter)
                    angular.element(result).scope().data.title = $scope.data.list[i].myListFilter;
            }
        }
    }, 1000);
}
