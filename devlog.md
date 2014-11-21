# ionic 初探
清新的UI，眼前一亮。又是用 angularjs,并且大量使用 ui-route,心中不禁窃喜，嘿～轻车熟路阿。
## ionic 结构
基于cordovad的轻量级移动 webapp 框架。充分利用 angularjs 的 SPA 能力。
看一下 bower.json
```js
"dependencies": {
  "angular": "~1.2.17",
  "angular-animate": "~1.2.17",
  "angular-sanitize": "~1.2.17",
  "angular-ui-router": "0.2.10",
  "collide": "1.0.0-beta.3"
}
```
collide 对于 web 前端可能比较陌生 `Collide is a powerful yet simple javascript animation engine for web and hybrid mobile apps`
至于 sanitize 我相信都有不少人用到过，用来安全parser html。
### ngCordova
实际上是 cordova 在 angular 下的 wapper。将 cordova 以 angular 的方式封装了下。
## 环境配置
### 前提
- node
- git
- cordova

### ionic 安装
照着官网一排命令敲过去即可，这里不详说。

## hack ionic sample（sidemenu）
### 第三方库引入
看到 sample 的列表的`ion-item`略显单调，就想给每个 item 加上 icon。
果断`bower install font-awesome --save`,引入 icon`<i class="fa fa-search"></i>`。
结果毫无反应，dom 中已经有了，就是不显示。仔细看了原来被包含在 `<a>`下，`<a><i></i></a>`。这必然
不对阿。遂，翻了下 source 如下
```js
IonicModule
.directive('ionItem', [
  '$animate',
  '$compile',
function($animate, $compile) {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', function($scope, $element) {
      this.$scope = $scope;
      this.$element = $element;
    }],
    scope: true,
    compile: function($element, $attrs) {
      var isAnchor = angular.isDefined($attrs.href) ||
        angular.isDefined($attrs.ngHref) ||
        angular.isDefined($attrs.uiSref);
      var isComplexItem = isAnchor ||
        //Lame way of testing, but we have to know at compile what to do with the element
        /ion-(delete|option|reorder)-button/i.test($element.html());

        if (isComplexItem) {
          var innerElement = jqLite(isAnchor ? ITEM_TPL_CONTENT_ANCHOR : ITEM_TPL_CONTENT);
          innerElement.append($element.contents());

          $element.append(innerElement);
          $element.addClass('item item-complex');
        } else {
          $element.addClass('item');
        }

        return function link($scope, $element, $attrs) {
          $scope.$href = function() {
            return $attrs.href || $attrs.ngHref;
          };
          $scope.$target = function() {
            return $attrs.target || '_self';
          };
        };
    }
  };
}]);
var ITEM_TPL_CONTENT_ANCHOR =
  '<a class="item-content" ng-href="{{$href()}}" target="{{$target()}}"></a>';
var ITEM_TPL_CONTENT =
  '<div class="item-content"></div>';
```
注意 isAnchor 和 isComplexItem。这里可能会被编译成 `<a>` 或者 `<div>`。由于 sample 中使用了 href
属性，所以这里只会被编译成 `<a>`。
PS：这里有一点比较奇怪，一般不会写 href,而是直接用 uiSref, 个人觉得用 uiSref 机动性更好些。
退而求其次，直接用 ionic 内置 icon 可以正常显示。
```js
<ion-item nav-clear menu-close class="item-icon-left" href="#/app/search">
   <i class="icon ion-document-text"></i>Search
</ion-item>
```
但是始终会遇到使用第三方的 css 的情况，所以还需要找出问题让 awesome 正常显示。
### ionic serve 夸域问题
尝试了 ionic 下使用$http, 请求其他域的RSS，结果给我报夸域错误。这里和`node-webkit`还不同，nw 可以直接访问外域。
查了下资料（资料不多)， 设置了`config.xml`中`<access origin="http://bt.ktxp.com"/>`
也没有作用。
配置公司 APP 的时候也同样有夸域问题。可能需要对`ionic serve`使用的 server 进行修改，使之
能够允许夸域请求。最差的情况，则是直接使用 http bind。
### emulate 失败
sample emulate 并没有报错，倒是公司 APP 的时候报错了，关于`q.js`的错误：
```js
module.js:340
    throw err;
          ^
Error: Cannot find module 'q'
    at Function.Module._resolveFilename (module.js:338:15)
    at Function.Module._load (module.js:280:25)
    at Module.require (module.js:364:17)
    at require (module.js:380:17)
    at Object.<anonymous> (/home/niko/workspace/salesphone/platforms/android/cordova/lib/spawn.js:23:15)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.require (module.js:364:17)
Error: /home/niko/workspace/salesphone/platforms/android/cordova/run: Command failed with exit code 8
    at ChildProcess.whenDone (/home/niko/.nvm/v0.10.33/lib/node_modules/cordova/node_modules/cordova-lib/src/cordova/superspawn.js:135:23)
    at ChildProcess.emit (events.js:98:17)
    at maybeClose (child_process.js:756:16)
    at Process.ChildProcess._handle.onexit (child_process.js:823:5)
```
目前来说毫无头绪。
