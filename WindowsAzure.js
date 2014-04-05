function MobileServiceAuthenticationProvider(){
}
MobileServiceAuthenticationProvider.Facebook = 'facebook';
function MobileServiceHTTPMethods(){
}
MobileServiceHTTPMethods.GET='GET';
MobileServiceHTTPMethods.POST='POST';
MobileServiceHTTPMethods.PATCH='PATCH';
MobileServiceHTTPMethods.PUT='PUT';
MobileServiceHTTPMethods.DELETE='DELETE';

function MobileServiceUser (userId) {
	if(!userId) throw new Error('A userId is required.');
	var authenticationToken = null;
	this.getUserId = function(){
		return userId;
	};
	this.setAuthenticationToken=function(v){
		authenticationToken=v;
	};
	this.getAuthenticationToken=function(){
		return authenticationToken;
	};
};
function LoginManager(mobileServiceClient) {
	if(!mobileServiceClient) throw new Error("A mobileServiceClient is required.");
	
	var LOGIN_URL = "login/";
	var TOKEN_JSON_PARAMETER = "authenticationToken";
	var USERID_JSON_PROPERTY = "userId";
	var USER_JSON_PROPERTY = "user";
	var ERROR_JSON_PROPERTY = "error";
	
	var createUser = function(jsonUserObj){
		if(!jsonUserObj) throw new Error("Cannot create a user from a null object");
		if(!jsonUserObj[USER_JSON_PROPERTY]) throw new Error(USER_JSON_PROPERTY + " property expected");
		if(!jsonUserObj[USER_JSON_PROPERTY][USERID_JSON_PROPERTY]) throw new Error(USER_JSON_PROPERTY + "."+ USERID_JSON_PROPERTY + " property expected");
		if(!jsonUserObj[TOKEN_JSON_PARAMETER]) throw new Error(TOKEN_JSON_PARAMETER + " property expected");
		var user = new MobileServiceUser(jsonUserObj[USER_JSON_PROPERTY][USERID_JSON_PROPERTY]);
		user.setAuthenticationToken(jsonUserObj[TOKEN_JSON_PARAMETER]);
		return user;
	};
	
	this.authenticateWithToken=function(provider, token, callBack) {
		if (!provider || !token || !callBack){
			throw new Error("All provider, token, and callBack are required.");
		}
		var xhr = Titanium.Network.createHTTPClient();
		xhr.setTimeout(mobileServiceClient.REQUEST_TIMEOUT);
		xhr.onload=function() {
			try{
				var user=createUser(JSON.parse(this.responseText));
				callBack(null,user);
			}
			catch(e){
				callBack(e);
			}
		};
		xhr.onerror= function(e1) {
			callBack(e1);
		};
		xhr.open(MobileServiceHTTPMethods.POST, mobileServiceClient.getAppUrl()+LOGIN_URL+provider);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Accept", "application/json");
		xhr.send({
		    "access_token" : token
		});
	};
};



function MobileServiceClient(appUrl, appKey) {
	if (!appUrl || !appKey){
		throw new Error("Both appUrl and appKey are required.");
	}
	
	var CUSTOM_API_URL = "api/";
	
	if(appUrl.charAt(appUrl.length-1) != '/'){
		appUrl+='/';
	} 
	var loginManager = new LoginManager(this);
	var loginInProgress = false;
	var mobileServiceUser = null;
	this.login=function(provider, oAuthToken, callBack) {
		if (!provider || !oAuthToken || !callBack){
			throw new Error("All provider, oAuthToken, and callBack are required.");
		}
		loginInProgress = true;
		loginManager.authenticateWithToken(provider,oAuthToken,function(err, user){
			if(err) callBack(err);
			else{
				mobileServiceUser=user;
				loginInProgress = false;
				callBack(null,user);
			}
		});
	};
	this.logout=function() {
		mobileServiceUser = null;
	};
	this.getAppKey=function() {
		return appKey;
	};
	this.getAppUrl=function() {
		return appUrl;
	};
	this.isLoginInProgress=function() {
		return loginInProgress;
	};
	this.getCurrentUser=function() {
		return mobileServiceUser;
	};
	this.invokeApi=function(apiName, httpMethod, requestBody, requestParam, callBack){
		if(!apiName || !httpMethod || !callBack) new Error("apiName, httpMethod, and callBack are required");
		if(!mobileServiceUser) callBack("User not logged in", null);
		else{
			var xhr = Titanium.Network.createHTTPClient();
			xhr.setTimeout(this.REQUEST_TIMEOUT);
			xhr.onload=function() {
				var o = JSON.parse(this.responseText);
				if(o['error']) callBack(o['error'],null);
				else callBack(null,o);
			};
			xhr.onerror= function() {
				callBack("Error occured while calling the api",null);
			};
			var url=appUrl+CUSTOM_API_URL+apiName;
			if(requestParam) url+='?'+this.buildHttpQuery(requestParam);
			xhr.open(httpMethod, url);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("X-ZUMO-AUTH", mobileServiceUser.getAuthenticationToken());
			if(requestBody) xhr.send(JSON.stringify(requestBody));
			else xhr.send();
		}
	};
}
MobileServiceClient.prototype.REQUEST_TIMEOUT=30000;
MobileServiceClient.prototype.invokeGetApi=function(apiName, requestParam, callBack){
	this.invokeApi(apiName, MobileServiceHTTPMethods.GET, null, requestParam, callBack);
};
MobileServiceClient.prototype.invokePostApi=function(apiName, requestBody, callBack){
	this.invokeApi(apiName, MobileServiceHTTPMethods.POST, requestBody, null, callBack);
};
MobileServiceClient.prototype.invokePatchApi=function(apiName, requestBody, requestParam, callBack){
	this.invokeApi(apiName, MobileServiceHTTPMethods.PATCH, requestBody, requestParam, callBack);
};
MobileServiceClient.prototype.invokePutApi=function(apiName, requestBody, requestParam, callBack){
	this.invokeApi(apiName, MobileServiceHTTPMethods.PUT, requestBody, requestParam, callBack);
};
MobileServiceClient.prototype.invokeDeleteApi=function(apiName, requestParam, callBack){
	this.invokeApi(apiName, MobileServiceHTTPMethods.DELETE, requestParam, callBack);
};
MobileServiceClient.prototype.buildHttpQuery=function(formdata, numeric_prefix, arg_separator) {
    var value, key, tmp = [],
        that = this;
    this.urlencode = function (str) {
        str = (str + '').toString();
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    };
    var _http_build_query_helper = function (key, val, arg_separator) {
        var k, tmp = [];
        if (val === true) {
            val = "1";
        } else if (val === false) {
            val = "0";
        }
        if (val != null) {
            if (typeof val === "object") {
                for (k in val) {
                    if (val[k] != null) {
                        tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
                    }
                }
                return tmp.join(arg_separator);
            } else if (typeof val !== "function") {
                return that.urlencode(key) + "=" + that.urlencode(val);
            } else {
                throw new Error('There was an error processing for http_build_query().');
            }
        } else {
            return '';
        }
    };

    if (!arg_separator) {
        arg_separator = "&";
    }
    for (key in formdata) {
        value = formdata[key];
        if (numeric_prefix && !isNaN(key)) {
            key = String(numeric_prefix) + key;
        }
        var query = _http_build_query_helper(key, value, arg_separator);
        if (query !== '') {
            tmp.push(query);
        }
    }
    return tmp.join(arg_separator);
};
exports.MobileServiceHTTPMethods=MobileServiceHTTPMethods;
exports.MobileServiceClient = MobileServiceClient; 
exports.MobileServiceAuthenticationProvider=MobileServiceAuthenticationProvider;
exports.version = '1.0.0';
exports.author = 'Faisal Rahman';