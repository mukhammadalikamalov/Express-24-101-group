import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid } from "@mui/material";
import { NavLink } from "react-router-dom";
import SearchBar from "./components/Form/SearchBar";
import Layout from "./components/layout/layout";

const searchApi = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const itemsPage = 9;

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [allSubcategories, setAllSubcategories] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://api.express24.uz/client/v5/catalog/stores?latitude=41.311191&longitude=69.279776&limit=20&rootCategoryId=2"
      )
      .then((response) => {
        setStores(response.data.list);
        setFilteredStores(response.data.list);
        const subcategories = response.data.list.reduce((acc, store) => {
          store.subCategories.forEach((subcategory) => {
            if (!acc.some((item) => item.id === subcategory.id)) {
              acc.push(subcategory);
            }
          });
          return acc;
        }, []);
        setAllSubcategories(subcategories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubcategoryFilter = (subcategoryId) => {
    if (subcategoryId === selectedSubcategory) {
      setSelectedSubcategory(null);
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter((store) =>
        store.subCategories.some((subcategory) => subcategory.id === subcategoryId)
      );
      setFilteredStores(filtered);
      setSelectedSubcategory(subcategoryId);
    }
  };

  const clearSubcategoryFilter = () => {
    setSelectedSubcategory(null);
    setFilteredStores(stores);
  };

  const searchRecipes = async () => {
    setIsLoading(true);
    const url = searchApi + query;
    const res = await fetch(url);
    const data = await res.json();
    setFilteredStores(data.meals);
    setIsLoading(false);
  };

  useEffect(() => {
    searchRecipes();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    searchRecipes();
  };

  return (
    <Layout>
      <SearchBar isLoading={isLoading} query={query} setQuery={setQuery} handleSubmit={handleSubmit} />
      <Box sx={{ flexGrow: 1, margin: "auto", maxWidth: "lg" }}>
        <h1>Restaurants</h1>
        <button
          onClick={clearSubcategoryFilter}
          style={{
            width: "150px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#f5f5dc",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
        >
          All Subcategories
        </button>
        {allSubcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => handleSubcategoryFilter(subcategory.id)}
            className={selectedSubcategory === subcategory.id ? "selected" : ""}
            style={{
              width: "100px",
              height: "50px",
              borderRadius: "13px",
              backgroundColor: selectedSubcategory === subcategory.id ? "#fff624" : "#f5f5dc",
              border: "none",
              cursor: "pointer",
              marginRight: "10px",
              transition: "background-color 0.3s",
            }}
          >
            {subcategory.name}
          </button>
        ))}

        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 12 }} spacing={0} marginTop={2}>
          {filteredStores.map((restaurant, index) => (
            <Grid item xs={4} sm={6} md={4} key={index}>
              <Box marginBottom={4}>
                <Box
                  width={359}
                  height={"auto"}
                  bgcolor={"#fff"}
                  borderRadius={"20px"}
                  boxShadow={4}
                  overflow="hidden"
                  display="flex"
                  flexDirection="column"
                >
                  <img style={{ width: "100%", height: "20vh" }} src={restaurant.cover} alt={restaurant.name} />
                  <div style={{ padding: "10px", flexGrow: 1 }}>
                    <h2>{restaurant.name}</h2>
                    <NavLink to={`/restaurant/${restaurant.id}`}>More</NavLink>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                    <div
                      style={{
                        width: "40%",
                        height: "5vh",
                        backgroundColor: "#00FF40",
                        borderRadius: "40px",
                        textAlign: "center",
                        color: "white",
                        fontSize: "20px",
                        paddingTop: "6px",
                      }}
                    >
                      {restaurant.id}
                    </div>
                  </div>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default HomePage;
