import { useMemo } from "react"

export const useDisplayUserRequests = (items, dictionaries) => {
    const displayUserRequests = useMemo(() => {
      let arr = [];
      items.forEach((item) => {
        let el = { ...item };
        let status_display = dictionaries['statuses'].find(e => e[0] === item.status);
        if (status_display) {
          el['status_display'] = status_display[1];
        }
        
        let department_display = dictionaries['departments'].find(e => e[0] === item.department);
        if (department_display) {
          el['department_display'] = department_display[1];
        }

        let management_display = dictionaries['managements'].find(e => e[0] === item.management);
        if (management_display) {
          el['management_display'] = management_display[1];
        }

        let db_display = dictionaries['dbs'].find(e => e[0] === item.db);
        if (db_display) {
          el['db_display'] = db_display[1];
        }

        arr.push(el);
      });

      return arr;

    }, [items, dictionaries]);
    
    return displayUserRequests;
}

export const useSortedUserRequests = (items, sort, order, dictionaries) => {
    const displayUserRequests = useDisplayUserRequests(items, dictionaries);
    
    const sortedUserRequests = useMemo(() => {
      if(sort) {
        if (order) {
          return [...displayUserRequests].sort((a, b) => {
            a = a[sort].toString();
            b = b[sort].toString();
            return a.localeCompare(b);
          });
        } else {
          return [...displayUserRequests].sort((a, b) => {
            a = a[sort].toString();
            b = b[sort].toString();
            return b.localeCompare(a);
          });
        }
      }
      
      return displayUserRequests;
     
      }, [sort, displayUserRequests, order]);
    
    return sortedUserRequests;
}

export const useUserRequests = (items, sort, queries, order, dictionaries) => {
    const sortedUserRequests = useSortedUserRequests(items, sort, order, dictionaries);
    
    const sortedAndSearchUserRequests = useMemo(() => {
      return sortedUserRequests.filter(item => {
        let condition = true;
        queries.forEach(element => {
          if (element.value !== '') {
            condition = condition && item[element.name].toString().toLowerCase().startsWith(element.value.toLowerCase());     
          }
        });
          return condition;
        });
      }, [queries, sortedUserRequests]);
    
    return sortedAndSearchUserRequests;
}