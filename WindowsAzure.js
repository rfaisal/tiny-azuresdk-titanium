function MobileServiceTable(tableName, client) {
    this.getTableName = function () {
        return tableName;
    };
    this.getMobileServiceClient = function () {
        return client;
    };
    this.systemProperties = 0;
}
function MobileServiceClient(applicationUrl, applicationKey) {        
            this.applicationUrl = applicationUrl;
            this.applicationKey = applicationKey || null;
        
            this.currentUser = null;
            this._serviceFilter = null;
            this._login = new MobileServiceLogin(this);
            this.getTable = function (tableName) {
                return new MobileServiceTable(tableName, this);
            };
}
exports.MobileServiceTable = MobileServiceTable;
exports.MobileServiceClient = MobileServiceClient; 
exports.version = '1.0.0';
exports.author = 'Faisal Rahman';