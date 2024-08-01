import React, { useEffect, useState } from 'react';
import '../recipies/recipies.css';

const Recipes = ({ onRecipeSelect = () => {}, selectedRecipes = [] }) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        
        fetch('https://dummyjson.com/recipes')
            .then(response => response.json())
            .then(data => {
                setRecipes(data.recipes);
                localStorage.setItem('allRecipes', JSON.stringify(data.recipes));
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }, []);

    return (
        <div className="recipes-container">
            {recipes.map(recipe => (
                <div
                    key={recipe.id}
                    className={`recipe-card ${selectedRecipes.includes(recipe.id) ? 'selected' : ''}`}
                    onClick={() => onRecipeSelect(recipe.id)}
                >
                    <div className="meal-type-tag">{recipe.mealType}</div>
                    <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                    <div className="recipe-content">
                        <h2 className="recipe-title">{recipe.name}</h2>
                        <p className="recipe-description">{recipe.instructions}</p>
                        <div className="recipe-meta">
                            <span><strong>Cuisine:</strong> {recipe.cuisine}</span>
                            <span><strong>Rating:</strong> {recipe.rating} <span className="stars">{'★'.repeat(Math.round(recipe.rating))}</span></span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Recipes;
