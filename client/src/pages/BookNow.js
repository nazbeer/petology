import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Tabs, Form, Input, Button } from 'antd';
import Layout from '../components/Layout';
import MobVet from './Forms/MobVet';
import MobGroom from './Forms/MobGroom';
import Vet from "./Forms/Vet";
import Groom from "./Forms/Groom";

const { TabPane } = Tabs;

const BookNow = () => {
    const [location, setLocation] = useState({ lat: 25.2048, lng: 55.2708 });
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
                <Vet/>
            </TabPane>
            <TabPane
            tab={customTab(require('../images/pet-grooming.png'), 'Grooming Shop')}
            key='grooming'
            >
               <Groom/>
            </TabPane>
        <TabPane
            tab={customTab(require('../images/van.png'), 'Mobile Vet')}
            key="mobileVet"
        >
            <MobVet location={location}/>
        </TabPane>
        <TabPane
            tab={customTab(require('../images/mobgrooming.png'), 'Mobile Grooming')}
            key="mobileGrooming"
        >
        <MobGroom location={location}/>
        </TabPane>
        </Tabs>
        </Layout>
  );
};

export default BookNow;
