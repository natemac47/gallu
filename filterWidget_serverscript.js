(function() {
    data.list = [];
    data.selectedFilter = $sp.getParameter('sel');
    data.list = new global.GUCSMServiceManagementUtil().getMyListsMenu();
    data.pageContentLoadedMsg = gs.getMessage('{0} content loaded');
})();
