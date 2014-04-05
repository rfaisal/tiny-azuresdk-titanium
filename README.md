AzureSDK for Titanium Mobile Applications
=================

### oAuth flow
1.  Verify the identity of the user by the native app and get a access_token.
2.  Use the access_token to login.

### TODOs
These are the TODO items. Feel free to contribute.

1.  Add options for specifying columns when getiing table data (currently returns all the columns), under development.
2.  Add support for returning multiple rows of a table beased on search (currently returns one row based on the id), under development.
3.  Currently only supports facebook, add other identity providers.
4.  Add support for Admin level access.
 
### Usage
1. Download `WindowsAzure.js` and put it in the `Resources\modules\` directory.
2. Initialize :


        var WindowsAzure = require('modules/WindowsAzure');
        var mClient = new WindowsAzure.MobileServiceClient('https://my-azure-app.azure-mobile.net/','my-azure-secret');
        
3. Login :


		mClient.login(WindowsAzure.MobileServiceAuthenticationProvider.Facebook,'CAAHn3...',
			function(_error,_user){
				if(_error){
					//handle _error
				}
				else{
					//_user.getUserId() and _user.getAuthenticationToken() available
				}
			}
		);
4. Look up a table by the primary id :



		mClient.getTable('my-table-name').lookUp('unique-primary-key',function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//_obj.column_name to access each column of the returned row
				}
		});
		
5. Insert to a table :



		mClient.getTable('my-table-name').insert({
			'column_1': 'column_1_value',
			'column_2': 'column_2_value'
		},function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//_obj.column_name to access each column of the newly inserted row
				}
		});
