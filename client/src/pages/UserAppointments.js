import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Tabs, Form, Input, Button } from 'antd';
import Layout from '../components/Layout';
import MobVeti from './UserAppointments/MobVeti';
import MobGroomi from './UserAppointments/MobGroomi';
import Veti from "./UserAppointments/Veti";
import Groomi from "./UserAppointments/Groomi";


const { TabPane } = Tabs;

const UserAppointments = () => {
   
    const customTab = (imageSrc, title) => (
        <div>
        <img src={imageSrc} alt={title} style={{ width: '24px', marginRight: '8px' }} />
        {title}
        </div>
    );

    return (
        <Layout>
            
        <Tabs defaultActiveKey="veterinary">
            <TabPane
            tab={customTab(require('../images/vet.png'), 'Veterinary Clinic')}
            key='veterinary'
            >
                <Veti/>
            </TabPane>
            <TabPane
            tab={customTab(require('../images/pet-grooming.png'), 'Grooming Shop')}
            key='grooming'
            >
               <Groomi/>
            </TabPane>
        <TabPane
            tab={customTab(require('../images/van.png'), 'Mobile Vet')}
            key="mobileVet"
        >
            <MobVeti/>
        </TabPane>
        <TabPane
            tab={customTab(require('../images/mobgrooming.png'), 'Mobile Grooming')}
            key="mobileGrooming"
        >
        <MobGroomi />
        </TabPane>
        </Tabs>

        </Layout>
  );
};

export default UserAppointments;
