(function(window){
    var isFunction = function(f){ return Object.prototype.toString.call(f)==='[object Function]'; };
    var isObject = function(o){ return o && o.constructor === Object; };
    var hasOwn = Object.prototype.hasOwnProperty;
    var extend = function(target, source){
        var key, copy;
        for(key in source){
            copy = source[key];
            if(target === copy){ continue; }
            if(copy && hasOwn.call(source, key)){
                target[key] = source[key];
            }
        }
        return target;
    };
    var T = function (ns, property) {
        if (typeof ns === 'string') {
            var nss = ns.split('.');
            var parent = T;
            if (ns.charAt(0) === '.') {
                nss.shift();
            }
            while (ns = nss.shift()) {
                parent[ns] = parent[ns] || {};
                parent = parent[ns];
            }
            if (isFunction(property)) {
                property.call(parent);
            } else if (isObject(property)) {
                extend(parent, property);
            }
            return parent;
        }
        return ns;
    };
    T.jsonpCallbackParams = function(name, callback) {
        window[name] = function () {
            window[name] = null;
            callback.apply(window, arguments);
        };
    };
    /*****************************************************/
    var noop = function(){};
    var $ = function(id){ return document.getElementById(id) };
    T('request', {
    	init:function(){
    		var q = location.search.toLowerCase();
    		if(q){
    			var match = q.slice(1).match(/([^&]+)=([^&]+)/g);
    			for(var i=0, len=match.length;i<len;i++){
    				q = match[i].split('=');
    				this.params[q[0]] = q[1];
    			}
    		}
    		this.init = noop;
    	},
    	params:{},
    	get:function(name){
    		this.init();
    		var p = this.params;
    		return p[name] || null;
    	}
    });
    T('share', {
    	init:function(url, title, pic){
    		this.createPannel();
    		title = title || document.title;
    		pic = pic ? pic + '_460x460.jpg' : $('J_ImgBooth').src;
    		this.bind('weibo',url,title,pic);
            this.bind('wangyi',url,title,pic);
            this.bind('qweibo',url,title,pic);
            this.bind('qzone',url,title,pic);
            this.bind('pengyou',url,title,pic);
    	},
    	api:{
    		'weibo': 'http://service.weibo.com/share/share.php?url={url}&title={title}&pic={pic}&language=zh_cn',
            'wangyi':'http://t.163.com/article/user/checkLogin.do?info={title}{url}&images={pic}&togImg=true',
	        'qweibo': 'http://share.v.t.qq.com/index.php?c=share&a=index&appkey=801314304&url={url}&title={title}&pic={pic}',
	        'qzone': 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&summary={title}&desc={title}&pics={pic}&otype=share',
	        'pengyou': 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&summary={title}&pics={pic}&to=pengyou'
    	},
        replaceAll:function(txt, reChr, newChr){
            return txt.replace(new RegExp(reChr, 'g'), newChr);
        },
    	bind:function(s, url, title, pic){
            var btn = $('topke-share-' + s);
            var href = T.share.getShareUrl(s);
            href = this.replaceAll(href, '{url}', encodeURIComponent(url));
            href = this.replaceAll(href, '{title}', encodeURIComponent(title));
            href = this.replaceAll(href, '{pic}', encodeURIComponent(pic));
            btn.onclick = function(){
            	window.open(href, '_blank');
            };
    	},
    	getShareUrl:function(type){
    		return this.api[type];
    	},
    	createPannel:function(){
    		var html = ['<div>分享至：</div><ul>'];
    		html.push('<li><a href="###" id="topke-share-weibo">新浪微博</a></li>');
            html.push('<li><a href="###" id="topke-share-wangyi">网易微博</a></li>');
    		html.push('<li><a href="###" id="topke-share-qweibo">腾讯微博</a></li>');
    		html.push('<li><a href="###" id="topke-share-qzone">QQ空间</a></li>');
    		html.push('<li><a href="###" id="topke-share-pengyou">QQ朋友</a></li>');
    		html.push('</ul>');
    		var div = document.createElement('div');
    		div.setAttribute('style',"position:fixed;top:10px;right:10px;padding:10px;border:1px solid #FC0;background-color:#CCC;font-weight:bold;z-index:999999;");
    		document.body.appendChild(div);
    		div.innerHTML = html.join('');
    	}
    });
    T('TopKe', {
    	init:function(){
    		var id = T.request.get('id');
    		var doReal = this.checkTrack();
    		if(id && doReal){
    			this.getTaobaokeItem(id);
    		}
    	},
    	checkTrack:function(){
    		var ali_id = T.request.get('ali_trackid');
    		var has_id = 'mm_11988958_0_0';
    		return (!ali_id) ? true : ali_id.indexOf(has_id)<0;
    	},
        getHead:function(){
            var doc = document;
            return doc.head || doc.getElementsByTagName('head')[0];
        },
    	getTaobaokeItem:function(id){
            var that = this;
            this.ajaxScript(id, function(d){
                that.ajaxCallback(d);
            });
    		//this.ajaxCallback({"taobaoke_items_detail_get_response":{"taobaoke_item_details":{"taobaoke_item_detail":[{"click_url":"http:\/\/s.click.taobao.com\/t?e=zGU34CA7K%2BPkqB07S4%2FK0CFcRfH0G7DbPkiN9MBfGmqKU811CBXVbSghMJz7gr1wYttoUY1ZTWJdhImHMOSQflkwlWf3CNGUB8IUkQsXO2KqkzStSvDr%2FFYKS5Q9o9tEMuEbeIWJXNaBpEKsnQxx5qV3YI%2FX8sylFInkCi7pDYEmeFIeIW5hd5UrF88QLg%3D%3D&spm=2014.21338611.1.0","item":{"pic_url":"http:\/\/img04.taobaocdn.com\/bao\/uploaded\/i4\/17957032183600031\/T1IzVbXrhdXXXXXXXX_!!0-item_pic.jpg","title":"韩都衣舍韩版2013春装新款保暖显瘦小脚裤抓绒休闲裤女NJ1003翝"}}]},"total_results":1}});
    	},
        jsonpScript:function(id, callback){
            var head = this.getHead();
            var script = document.createElement('script');
            var src = 'http://liuxf2010.xvip222.asccf.com/TopKe/tbkitem.asp?id='+id+'&jsonp=taobaoke_items_detail_get_response';
            T.jsonpCallbackParams('taobaoke_items_detail_get_response', callback);
            script.src = src;
            head.insertBefore(script, head.firstChild);
        },
        ajaxScript:function(id, callback){
            var url = 'http://liuxf2010.xvip222.asccf.com/TopKe/tbkitem.asp?id='+id;
            var xhr = new XMLHttpRequest;
            xhr.open('GET', url, true);
            xhr.onload = function(){
                callback(JSON.parse(xhr.responseText));
            };
            xhr.send();
        },
    	ajaxCallback:function(d){
    		var path = 'http://www.lady172.com/go.html';
    		var data = d.taobaoke_items_detail_get_response;
    		if(data.total_results){
    			data = data.taobaoke_item_details.taobaoke_item_detail[0];
    			var i = data.click_url.indexOf('?');
    			var url = path + data.click_url.slice(i);
    			var title = data.item.title;
    			var pic = data.item.pic_url;
    			T.share.init(url, title, pic);
    		}
    		
    	}
    });
    T.TopKe.init();
}(this));