import '../styles/App.scss';
import 'rsuite/dist/styles/rsuite-default.css';
import {useHistory} from "react-router-dom";
import {Navbar, Nav, Icon, Dropdown} from 'rsuite'
import { Pane, Text} from 'evergreen-ui';
import * as React from 'react'

const NavBarInstance = ({ onSelect, activeKey, ...props }) => {

    const history = useHistory();

    const goToForum = () => {
      history.push('/forum');
    }

    const goToDashboard = () => {
      history.push('/dashboard');
    }

    const goToDeposit = () => {
      history.push('/deposit');
    }

    const goToSend = () => {
      history.push('/send');
    }

    const goToTransactions = () => {
      history.push('/transactions');
    }

    const goToSettings = () => {
      history.push('/settings');
    }

    const doLogOut = () => {
    
      localStorage.clear();
      history.push('/');
  }

    return (
      <Navbar {...props}>
        <Navbar.Header>
          <a href="#" className="navbar-brand logo">
            Evo Bank
          </a>
        </Navbar.Header>
        <Navbar.Body>
          <Nav onSelect={onSelect} activeKey={activeKey}>
            <Nav.Item eventKey="1" onClick={goToDashboard} icon={<Icon icon="home" />}>
              Home
            </Nav.Item>
            <Nav.Item eventKey="2" onClick={goToDeposit}>Deposit</Nav.Item>
            <Nav.Item eventKey="3" onClick={goToTransactions}>Transactions</Nav.Item>
            <Nav.Item eventKey="4" onClick={goToSend}>Send Money</Nav.Item>
            <Nav.Item eventKey="5" onClick={goToForum}>Forum</Nav.Item>
            <Dropdown title="About">
              <Dropdown.Item eventKey="6">Company</Dropdown.Item>
              <Dropdown.Item eventKey="7">Team</Dropdown.Item>
              <Dropdown.Item eventKey="8">Contact</Dropdown.Item>
            </Dropdown>
            <Nav.Item icon={<Icon icon="cog"/>} eventKey="10" onClick={goToSettings}>Account Settings</Nav.Item>
          </Nav>
          <Nav pullRight>
            <Nav.Item icon={<Icon icon="sign-out" />} onClick={doLogOut} >Log Out</Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
    );
  };
  
  class Header extends React.Component {
    constructor(props) {
      super(props);
      this.handleSelect = this.handleSelect.bind(this);
      this.state = {
        activeKey: null
      };
    }
    handleSelect(eventKey) {
      this.setState({
        activeKey: eventKey
      });
    }
    render() {
      const { activeKey } = this.state;
      return (
        <div className="nav-wrapper" display="flex" flexBasis="10%">
          <NavBarInstance appearance="inverse" activeKey={activeKey} onSelect={this.handleSelect} />
        </div>
      );
    }
  }
  
  function Footer() {
    return (
        <Pane width="100%" flexBasis="5%" backgroundColor="#00b0ff" display="flex" justifyContent="center" alignItems="center">
            <Text color="white">Copyright @EvoBankInc</Text>
        </Pane> 
    );
  }

  export {Header, Footer};
  