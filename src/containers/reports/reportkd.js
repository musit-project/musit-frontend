import { connect } from 'react-redux';
import { loadKDReport } from '../../reducers/reports';
import KDReport from '../../components/reports/reportkd';

const mapStateToProps = (state) => {
  return {
    data: state.reports && state.reports.data ? state.reports.data.kdreport.data : null,
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadKDReport: (museumId) => dispatch(loadKDReport(museumId))
});

export default connect(mapStateToProps, mapDispatchToProps)(KDReport);