import "./Sidebar.css";
import {Home, Equalizer, Newspaper, List, Map, ChatBubble, Notifications, Coronavirus, Healing} from '@mui/icons-material';

export default function Sidebar() {
  return (
    <div className="Sidebar">
        <div className="SidebarWrapper">
            <div className="SidebarMenu">
                <h3 className="SidebarTitle">Dashboard</h3>
                <ul className="SidebarList">
                    <li className="SidebarListItem">
                        <Home className="SidebarIcon"/>
                        Overview 
                    </li>
                    <li className="SidebarListItem">
                        <Equalizer className="SidebarIcon"/>
                        Vaccine Statistics
                    </li>
                    <li className="SidebarListItem">
                        <Coronavirus className="SidebarIcon"/>
                        Outbreaks
                    </li>
                </ul>
            </div>

            <div className="SidebarMenu">
                <h3 className="SidebarTitle">Public Resources</h3>
                <ul className="SidebarList">
                    <li className="SidebarListItem">
                        <Newspaper className="SidebarIcon"/>
                        News
                    </li>
                    <li className="SidebarListItem">
                        <List className="SidebarIcon"/>
                        FAQ
                    </li>
                    {/*<li className="SidebarListItem">
                        <Map className="SidebarIcon"/>
                        Testing Sites
                    </li>*/}
                    <li className="SidebarListItem">
                        <Healing className="SidebarIcon"/>
                        Symptoms
                    </li>
                </ul>

                
            </div>

            <div className="SidebarMenu">
                <h3 className="SidebarTitle">Notifications</h3>
                <ul className="SidebarList">
                    <li className="SidebarListItem">
                        <Home className="SidebarIcon"/>
                        My Account
                    </li>
                    {/*<li className="SidebarListItem">
                        <Map className="SidebarIcon"/>
                        My Testing Sites
                    </li>*/}
                    <li className="SidebarListItem">
                        <ChatBubble className="SidebarIcon"/>
                        <span className="topbarIconBadge">2</span> 
                        Messages
                    </li>
                    <li className="SidebarListItem">
                        <Notifications className="SidebarIcon"/>
                        Notifications
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}
