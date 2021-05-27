import './styles/App.scss';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Dashboard} from './components/Dashboard';
import {DashboardSupport} from './components/DashboardSupport';
import {Register} from './components/Register';
import {Login} from './components/Login';
import {Forum} from './components/Forum';
import {ForumSupport} from './components/ForumSupport';
import {RegisteredUsers} from './components/Admin/RegisteredUsers';
import {Graphs} from './components/Admin/Graphs';
import {AccountSettings} from './components/AccountSettings';
import {SendMoney} from './components/SendMoney';
import {DepositMoney} from './components/Deposit';
import {Transactions} from './components/Transactions';

function App() {

  return (
    <Router basename="/">
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/settings" component={AccountSettings}></Route>
        <Route exact path="/dashboard" component={Dashboard}></Route>
        <Route exact path="/dashboard_support" component={DashboardSupport}></Route>
        <Route exact path="/forum" component={Forum}></Route>
        <Route exact path="/forum_support" component={ForumSupport}></Route>
        <Route exact path="/users" component={RegisteredUsers}></Route>
        <Route exact path="/graphs" component={Graphs}></Route>
        <Route exact path="/send" component={SendMoney}></Route>
        <Route exact path="/deposit" component={DepositMoney}></Route>
        <Route exact path="/transactions" component={Transactions}></Route>
        
      </Switch>
    </Router>
  );
}

export default App;