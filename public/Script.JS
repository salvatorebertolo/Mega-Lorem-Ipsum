const recordTableBody = document.getElementById('recordTable').getElementsByTagName('tbody')[0];
const addRecordBtn = document.getElementById('addRecordBtn');
const recordModal = document.getElementById('recordModal');
const closeModalBtn = document.getElementsByClassName('close')[0];
const recordForm = document.getElementById('recordForm');
const baseUrl = 'http://localhost:3000/records';
const confirmationDialog = document.getElementById('confirmationDialog');
const confirmationMessage = document.getElementById('confirmationMessage');
const confirmYesBtn = document.getElementById('confirmYes');
const confirmNoBtn = document.getElementById('confirmNo');

let deleteCallback = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchRecords();
    handleHashChange(); 

    addRecordBtn.addEventListener('click', () => {
        openModal();
    });
});

function fetchRecords() {
    fetch(baseUrl)
        .then(response => response.json())
        .then(records => {
            console.log('Fetched records:', records);
            recordTableBody.innerHTML = ''; 
            records.forEach(record => addRecordToTable(record));
        })
        .catch(error => console.error('Error fetching records:', error));
}

function addRecordToTable(record) {
    let row = recordTableBody.querySelector(`tr[data-id='${record.id}']`);
    if (!row) {
        row = recordTableBody.insertRow();
        row.setAttribute('data-id', record.id);
    }
    
    row.innerHTML = `
        <td>${record.id}</td>
        <td>${record.column1}</td>
        <td>${record.column2}</td>
        <td>${record.column3}</td>
        <td>${record.column4}</td>
        <td>${record.column5}</td>
        <td>
            <button onclick="openModal(${record.id})">Edit</button>
            <button onclick="confirmDelete(${record.id})">Delete</button>
        </td>
    `;
}

function openModal(recordId = null) {
    if (recordId) {
        fetch(`${baseUrl}/${recordId}`)
            .then(response => response.json())
            .then(record => {
                document.getElementById('recordId').value = record.id;
                document.getElementById('column1').value = record.column1;
                document.getElementById('column2').value = record.column2;
                document.getElementById('column3').value = record.column3;
                document.getElementById('column4').value = record.column4;
                document.getElementById('column5').value = record.column5;
                recordModal.classList.add('open');
                window.location.hash = `record=${recordId}`;
            });
    } else {
        recordForm.reset();
        document.getElementById('recordId').value = '';
        recordModal.classList.add('open');
        window.location.hash = '';
    }
}

function closeModal() {
    recordModal.classList.remove('open');
    window.location.hash = '';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

document.addEventListener('click', (event) => {
    if (event.target === recordModal) {
        closeModal();
    }
});

closeModalBtn.addEventListener('click', closeModal);

recordForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = document.getElementById('recordId').value;
    const record = {
        column1: document.getElementById('column1').value,
        column2: document.getElementById('column2').value,
        column3: document.getElementById('column3').value,
        column4: document.getElementById('column4').value,
        column5: document.getElementById('column5').value
    };

    if (id) {
        fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        })
            .then(response => response.json())
            .then(updatedRecord => {
                addRecordToTable(updatedRecord);
                closeModal();
            })
            .catch(error => console.error('Error updating record:', error));
    } else {
        fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        })
            .then(response => response.json())
            .then(newRecord => {
                addRecordToTable(newRecord);
                closeModal();
            })
            .catch(error => console.error('Error adding record:', error));
    }
});

function confirmDelete(recordId) {
    if (confirm('Are you sure you want to delete this record?')) {
        deleteRecord(recordId);
    }
}

function deleteRecord(recordId) {
    fetch(`${baseUrl}/${recordId}`, { method: 'DELETE' })
        .then(() => {
            recordTableBody.querySelector(`tr[data-id='${recordId}']`).remove();
        })
        .catch(error => console.error('Error deleting record:', error));
}

function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash.startsWith('record=')) {
        const recordId = parseInt(hash.split('=')[1], 10);
        openModal(recordId);
    }
}

function showConfirmationDialog(message, callback) {
    confirmationMessage.textContent = message;
    deleteCallback = callback;
    confirmationDialog.classList.add('open');
}

function hideConfirmationDialog() {
    confirmationDialog.classList.remove('open');
}

confirmYesBtn.addEventListener('click', () => {
    if (deleteCallback) {
        deleteCallback();
        deleteCallback = null;
    }
    hideConfirmationDialog();
});

confirmNoBtn.addEventListener('click', () => {
    deleteCallback = null;
    hideConfirmationDialog();
});

confirmationDialog.addEventListener('click', (event) => {
    if (event.target === confirmationDialog) {
        hideConfirmationDialog();
    }
});

function confirmDelete(recordId) {
    showConfirmationDialog('Are you sure you want to delete this record?', () => {
        deleteRecord(recordId);
    });
}
