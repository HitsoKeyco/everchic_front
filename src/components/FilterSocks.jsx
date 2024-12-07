
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Autocomplete, TextField } from '@mui/material';

const FilterSocks = ({ categories, collections, filterOptionsCategory, setSearchCategory, setPagination, setSearchCollection, changeFilter, setChangeFilter, setProductsAPI }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);       
    if (newValue == 0) {      
      setProductsAPI([])  
      setSearchCategory('')
      setSearchCollection(false);     
      setChangeFilter(!changeFilter)  //actualización
    }
  };

  const handleCategoryChange = (event, value) => {
    if (value) {      
      setSearchCategory(value.id);
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      setChangeFilter(!changeFilter)  //actualización
    } else {
      setSearchCategory('')
      setChangeFilter(!changeFilter)  //actualización
    }
  };

  const handleCollectionChange = (event, value) => {    
    if (value) {                  
      setSearchCollection(true);
      setSearchCategory('');      
      setChangeFilter(!changeFilter)  //actualización
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      } else {                
        setProductsAPI([])
        

    }
  };

  return (
    <>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Categoría" />
        <Tab label="Colecciones" />
      </Tabs>

      
      {activeTab === 0 && (
        <Autocomplete
          id="filter-category"
          options={categories}
          getOptionLabel={(option) => option.name}
          filterOptions={filterOptionsCategory}
          onChange={handleCategoryChange}
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Selecciona una Categoría" />}
        />
      )}


      {activeTab === 1 && (
        <Autocomplete
          options={collections}
          getOptionLabel={(option) => option.name}
          onChange={handleCollectionChange}
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Agrupar por" />}
        />
      )}


    </>
  );
};

FilterSocks.propTypes = {
  categories: PropTypes.array.isRequired,
  collections: PropTypes.array.isRequired,
  filterOptionsCategory: PropTypes.func.isRequired,
  setSearchCategory: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  setSearchCollection: PropTypes.func.isRequired,
  changeFilter: PropTypes.bool.isRequired,
  setChangeFilter: PropTypes.func.isRequired,
  setProductsAPI: PropTypes.func.isRequired,
};

export default FilterSocks;
