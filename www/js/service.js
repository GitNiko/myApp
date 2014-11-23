/* Services */
angular.module('starter.service', ['cb.x2js'])
/**
 *
 * @ngdoc service
 * @name RssManage
 * @description 提供Rss相关的获取功能
 */
.factory('RssManage', ['$http','x2js',
  function($http, x2js) {
    /* api */
    return {
      getRss: function(callback) {
        $http.get('http://localhost:8100/rss-sort-1.xml').success(function(data) {
          var rssData = x2js.xml_str2json(data);
          var rssObj = {};
          rssObj.itemList = rssData.rss.channel.item;
          // $scope.channelMeta.title = rssData.rss.channel.title.toString();
          // $scope.srcItemList = rssData.rss.channel.item;
          // $scope.itemList = $scope.srcItemList;
          // rssService.renderBg($scope.srcItemList);
          //var result = $filter('regex')($scope.itemlist, '__cdata', '^【JOJO.*');
          //console.log(result);
          callback(rssObj);
        });
      },
      getNewRss: function(callback) {
        // TODO
      }
    }
  }
]);
