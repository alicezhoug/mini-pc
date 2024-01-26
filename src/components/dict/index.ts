import { getDictDetail,getDictDetailWithValue } from '@/api/system/dict';
import { ref } from 'vue';

// eslint-disable-next-line import/prefer-default-export
export function useDict(...dictNames: string[]) {
  const res: {
    [key: string]: any;
  } = ref({});

  return (() => {
    dictNames.forEach((d) => {
      getDictDetail(d).then((resp) => {
        res.value[d] = resp.data;
      });
    });
    return res.value;
  })();
}


// eslint-disable-next-line import/prefer-default-export
export function useDictWithNumber(...dictNames: string[]) {
	
  const res: {
    [key: string]: any;
  } = ref({});
  
  return (() => {
    dictNames.forEach((d) => {
      getDictDetail(d).then((resp) => {	
		
		  const newArr =ref();
		  resp.data.forEach((item)=>{
			 newArr.value.push(item);
		  });
		  res.value[d] = newArr
		 
         
      });
    });
    return res.value;
  })();
  
}


export interface DictLabelValue {
  dictId: number;
  detailId: number;
  name: string;
  value: string;
}

// eslint-disable-next-line import/prefer-default-export
export function mapUseDict(...dictNames: string[]) {
	

  const res: {
    [key: string]: any;
  } = ref<{[key: string]: DictLabelValue }>({});

  return (() => {
    dictNames.forEach((d) => {
      getDictDetail(d).then((resp) => {
		resp.data.forEach((item)=>{
			res.value[item.value] =item;
		});
      });
    });
    return res.value;
  })();
}