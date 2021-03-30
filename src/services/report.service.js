import report from "../http-reports";

class ReportDataService {
  getUserData(data) {
    return report.post("/users-data", data);
  }

  getUserTransaction(data){
  	return report.post("/users-transaction", data);
  }

  getCountPerDay(data){
    /* eslint-disable-next-line  */
    if(data.summary == 0)
      return report.post(`/total-count-per-day?date_from=${data.dateFrom}&date_to=${data.dateTo}&status=${data.status}&approved=${data.approve}`);
    else
      return report.post(`/total-amount-perday?date_from=${data.dateFrom}&date_to=${data.dateTo}&status=${data.status}&approved=${data.approve}`);
  }

  getTotaCountPerBenefit(data){
    /* eslint-disable-next-line  */
    if(data.summary == 0)
    	return report.post(`/total-count-per-benefit?date_from=${data.dateFrom}&date_to=${data.dateTo}&status=${data.status}&approved=${data.approve}`);
    else
      return report.post(`/total-amount-per-benefit?date_from=${data.dateFrom}&date_to=${data.dateTo}&status=${data.status}&approved=${data.approve}`);
  }

  getTotalCountPerCategory(data){
    /* eslint-disable-next-line  */
    if(data.summary == 0)    
      return report.post(`/total-count-per-category?date_from=${data.dateFrom}&date_to=${data.dateTo}&status=${data.status}&approved=${data.approve}`);
    else
      return report.post(`/total-amount-per-category?date_from=${data.dateFrom}&date_to=${data.dateTo}&status=${data.status}&approved=${data.approve}`);
  }

  getTotaCountPerDepartment(data){
    /* eslint-disable-next-line  */
    if(data.summary == 0)
      return report.post(`/total-count-per-department?date_from=${data.dateFrom}&date_to=${data.dateTo}&status=${data.status}&approved=${data.approve}`);
    else
      return report.post(`/total-amount-per-department?date_from=${data.dateFrom}&date_to=${data.dateTo}&status=${data.status}&approved=${data.approve}`);
  }




}

export default new ReportDataService();