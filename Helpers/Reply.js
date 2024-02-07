
export default  {
    success: (message , data = null  , extra = null) => {
     var result = {
         status_code: "1",
         status_text: "success",
         message: message,
     };

     if(data || data == [] ) result['data'] = data; 

     if(extra)  Object.assign(result,extra); 

     return result;
    },
  
    failed: (message) => {
        return {
            status_code: "0",
            status_text: "failed",
            message: message,
        }
    },

    unauth: () => {
        return {
            status_code: "0",
            status_text: "failed",
            message: 'Unauthenticated',
        }
    },

    notfound: () => {
        return {
            status_code: "0",
            status_text: "failed",
            message: 'Not Found',
        }
    },

    
    paginate: (page , array_data , per_page, total_count) => {
        const reminder = total_count % per_page ;
        const total_page = parseInt(total_count / per_page ); 
        const last_page = reminder != 0 ? total_page + 1 : total_page ;
       return {
            current_page: page,
            data: array_data,
            from: (array_data.length != 0)  ? 1 : null,
            to:   (array_data.length != 0 ) ? array_data.length : null,
            last_page: last_page,
            per_page: per_page,
            total: total_count
        };
        // current_page ,data, from, last_page, per_page, to, total
    },

    firstError:(validation) =>{
        let first_key = Object.keys(validation.errors.errors)[0];	
        return validation.errors.first(first_key);	

    }
  };
 