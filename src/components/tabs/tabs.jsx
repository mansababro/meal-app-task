import React, { useState, useEffect } from 'react';
import '../tabs/tabs.css';
import { Modal, Button } from 'react-bootstrap';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Recipes from '../recipies/recipies';

const Tabs = ({ activeTab, setActiveTab }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [weekRecipes, setWeekRecipes] = useState(
        JSON.parse(localStorage.getItem('weekRecipes')) || {
            'Week 1': [],
            'Week 2': [],
            'Week 3': [],
            'Week 4': []
        }
    );
    const [selectedWeek, setSelectedWeek] = useState(null);

    useEffect(() => {
        const storedSelectedRecipes = JSON.parse(localStorage.getItem('selectedRecipes')) || [];
        setSelectedRecipes(storedSelectedRecipes);
    }, []);

    useEffect(() => {
        localStorage.setItem('weekRecipes', JSON.stringify(weekRecipes));
    }, [weekRecipes]);

    useEffect(() => {
        localStorage.setItem('selectedRecipes', JSON.stringify(selectedRecipes));
    }, [selectedRecipes]);

    const handleAddToWeek = () => {
        if (selectedWeek) {
            const updatedWeekRecipes = {
                ...weekRecipes,
                [selectedWeek]: [
                    ...new Set([...weekRecipes[selectedWeek], ...selectedRecipes])
                ]
            };

            setWeekRecipes(updatedWeekRecipes);
            setSelectedRecipes([]);
            setShowModal(false);
            setSelectedWeek(null);
        }
    };

    const handleRecipeSelect = (recipeId) => {
        setSelectedRecipes((prevSelectedRecipes) =>
            prevSelectedRecipes.includes(recipeId)
                ? prevSelectedRecipes.filter((id) => id !== recipeId)
                : [...prevSelectedRecipes, recipeId]
        );
    };

    const handleRecipeRemove = (week, recipeId) => {
        const updatedWeekRecipes = {
            ...weekRecipes,
            [week]: weekRecipes[week].filter(id => id !== recipeId)
        };

        setWeekRecipes(updatedWeekRecipes);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedWeek(null); 
    };

    return (
        <div className="week-orders">
            <div className="weeks-nav">
                {['All Meals', 'Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => (
                    <div
                        key={week}
                        className={`week-option ${activeTab === week ? 'active' : ''}`}
                        onClick={() => setActiveTab(week)}
                    >
                        {week}
                    </div>
                ))}
                <div className="wrapbutton">
                    <button
                        className="add-button"
                        disabled={activeTab !== 'All Meals' || selectedRecipes.length === 0}
                        onClick={() => setShowModal(true)}
                    >
                        Add to Week
                    </button>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Week</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => (
                        <Button
                            key={week}
                            className={`modal-week-button ${selectedWeek === week ? 'selected' : ''}`}
                            onClick={() => setSelectedWeek(week)}
                            style={{ backgroundColor: selectedWeek === week ? 'black' : '', color: selectedWeek === week ? 'white' : '' }}
                        >
                            {week}
                        </Button>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleAddToWeek}
                        disabled={!selectedWeek}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="recipes-list">
                {activeTab === 'All Meals' ? (
                    <Recipes onRecipeSelect={handleRecipeSelect} selectedRecipes={selectedRecipes} />
                ) : (
                    weekRecipes[activeTab].length === 0 ? (
                        <p>No recipes added to this week yet.</p>
                    ) : (
                        weekRecipes[activeTab].map(recipeId => (
                            <RecipeCard 
                                key={recipeId} 
                                recipeId={recipeId} 
                                week={activeTab} 
                                onRemove={handleRecipeRemove} 
                            />
                        ))
                    )
                )}
            </div>
        </div>
    );
};

const RecipeCard = ({ recipeId, week, onRemove }) => {
    const allRecipes = JSON.parse(localStorage.getItem('allRecipes')) || [];
    const recipe = allRecipes.find(r => r.id === recipeId);

    return (
        recipe && (
            <div className="recipe-card">
                <div className="meal-type-tag">{recipe.mealType}</div>
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                <div className="recipe-content">
                    <h2 className="recipe-title">{recipe.name}</h2>
                    <p className="recipe-description">{recipe.instructions}</p>
                    <div className="recipe-meta">
                        <span><strong>Cuisine:</strong> {recipe.cuisine}</span>
                        <span><strong>Rating:</strong> {recipe.rating} <span className="stars">{'★'.repeat(Math.round(recipe.rating))}</span></span>
                    </div>
                    <IconButton 
                        aria-label="delete" 
                        onClick={() => onRemove(week, recipeId)} 
                        style={{ position: 'absolute', top: '0px', right: '10px' }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
        )
    );
};

export default Tabs;
