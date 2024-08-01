import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Header from '../header/header';
import "../layout/layout.css";
import Tabs from '../tabs/tabs';
import Recipes from '../recipies/recipies';

const Layout = () => {
    const [activeTab, setActiveTab] = useState('All Meals');

    return (
        <>
            <Container fluid>
                <Row>
                    <Col lg={12} sm={12} className='header'>
                        <Header />
                    </Col>
                </Row>

                <Row>
                    <Col lg={12} sm={12} className='heading'>
                        <h3 className='Headingh3'>Week Orders</h3>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12} sm={12} className='tabs'>
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    </Col>
                </Row>

                {activeTab === 'All Meals' && (
                    <Row>
                        <Col lg={12} sm={12} className='recipies'>
                            <Recipes />
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
};

export default Layout;
