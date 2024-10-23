import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Item } from '../../interface/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth'; // Importa Auth
import { Firestore } from 'firebase/firestore';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  itemId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService<Item>,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.firestoreService.setCollectionName('items');
  }

  async ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      await this.firestoreService.getItem(this.itemId)
        .then(item => {
          if (item) {
            this.itemForm.patchValue(item);
          }
        });
    }
  }

  saveItem() {
    if (this.itemForm.valid) {
      const newItem: Item = {
        ...this.itemForm.value
      };

      this.firestoreService.addItem(newItem).then(
        (res: boolean) => {
          if (res) {
            console.log('Item added');
            this.router.navigate(['/items']);
          }
        }).catch(error => {
          console.error('Error adding item: ', error);
        });

    }
  }
}
