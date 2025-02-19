package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

const esURL = "https://210.246.200.160:9200/wazuh-alerts*/_search"
const esUsername = "admin"
const esPassword = "ITULgIHEhZHb8vxX+"

type Alert struct {
	// ตัวแปรที่ใช้เก็บข้อมูลจาก Elasticsearch
	ID     string `json:"_id"`
	Source struct {
		GeoLocation struct {
			Location struct {
				Lat float64 `json:"lat"`
				Lon float64 `json:"lon"`
			} `json:"location"`
		} `json:"GeoLocation"`
	} `json:"_source"`
}

func getAlerts(w http.ResponseWriter, r *http.Request) {
	query := `{
		"query": {
			"term": {
				"rule.groups": "attack"
			}
		}
	}`

	client := &http.Client{}
	req, err := http.NewRequest("POST", esURL, strings.NewReader(query))
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating request: %v", err), http.StatusInternalServerError)
		return
	}
	req.SetBasicAuth(esUsername, esPassword)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error sending request: %v", err), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error reading response body: %v", err), http.StatusInternalServerError)
		return
	}

	var result struct {
		Hits struct {
			Hits []Alert `json:"hits"`
		} `json:"hits"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		http.Error(w, fmt.Sprintf("Error unmarshalling response: %v", err), http.StatusInternalServerError)
		return
	}

	// ส่งข้อมูลกลับเป็น JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result.Hits.Hits)
}

func main() {
	http.HandleFunc("/api/alerts", getAlerts)

	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
