AzureSDK for Titanium Mobile Applications
=================

### oAuth flow
1.  Verify the identity of the user by the native app, i.e., facebook and get a access_token.
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


		mClient.login(WindowsAzure.MobileServiceAuthenticationProvider.Facebook,'facebook_access_token',
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
		
5. Update a row of a table :



		mClient.getTable('my-table-name').update('unique-primary-key',
		{
			'column_1': 'updated_1_value',
			'column_2': 'updated_2_value'
		},
		function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//_obj.column_name to access each column of the updated row
				}
		});

4. Delete a row from a table by the primary id :



		mClient.getTable('my-table-name').del('unique-primary-key',function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//successful
				}
		});
		
		
4. Calling custom API by HTTP GET:



		mClient.invokeGetApi('api_name',{
				'url_param_1' : 'some value',
				'url_param_2' : 'other value'
			},
			function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//_obj is the GET response.
				}
			}
		);
		
4. Calling custom API by HTTP POST:



		mClient.invokePostApi('api_name',{
				'req_body_1' : 'some value',
				'req_body_2' : 'this can be a complex object'
			},
			function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//_obj is the POST response.
				}
			}
		);
		
		
4. Calling custom API by HTTP PUT:



		mClient.invokePutApi('api_name',{
				'req_body_1' : 'some value to be updated',
				'req_body_2' : 'this can be a complex object'
			},
			{
				'url_param_1' : 'ideally an id to uniquely identify the object to update',
				'url_param_2' : 'some other value'
			}
			function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//_obj is the PUT response.
				}
			}
		);
		
		
4. Calling custom API by HTTP PATCH:



		mClient.invokePatchApi('api_name',{
				'req_body_1' : 'some value to be updated',
				'req_body_2' : 'this can be a complex object'
			},
			{
				'url_param_1' : 'ideally an id to uniquely identify the object to update',
				'url_param_2' : 'some other value'
			}
			function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//_obj is the PATCH response.
				}
			}
		);
		
		
		
4. Calling custom API by HTTP DELETE:



		mClient.invokeDeleteApi('api_name',
			{
				'url_param_1' : 'ideally an id to uniquely identify the object to delete',
				'url_param_2' : 'may be u need 2 values to uniquely identify the object'
			}
			function(_error,_obj){
				if(_error){
					//handle _error
				}
				else{
					//_obj is the DELETE response.
				}
			}
		);
